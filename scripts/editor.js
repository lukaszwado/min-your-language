/**
 * @author Lukasz
 * @date 17/02/2017.
 */
'use strict';

(function ( document, window ) {
  const Scope = window[ 'l.wado' ].Scope
    ;

  class Editor {
    constructor( appName, initialData, animationDuration = 1500, keyframes ) {
      this.appName = appName;
      this.rootElement = document.querySelector( `[lw-app=${appName}]` );
      this.rootElement.$$scope = new Scope( appName, this.deepClone( initialData ) );
      this.rootScope = this.getRootElement().$$scope;
      this.animationStep = animationDuration;
      this.parseLoops();
      this.keyframes = keyframes;
    }

    /**
     * Deep clone of an Object
     * @param {Object} data
     * @return {Object}
     */
    deepClone( data ) {
      const cloned = JSON.parse( JSON.stringify( data ) )
        ;

      data.forEach( ( element, index ) => cloned[ index ].indent = element.indent );

      return cloned;
    }

    /**
     * Returns root element
     * @return {Element}
     */
    getRootElement() {
      return this.rootElement;
    }

    /**
     * Recursively parse all lw-loops
     */
    parseLoops() {
      const loop = this.findNextLoopToParse()
        ;

      if ( !loop ) {
        return;
      }
      const [ localDataKey, , parentPropertyKey ] = loop.getAttribute( 'lw-repeat' ).split( ' ' )
        , parentElement = loop.parentNode
        , siblingsArray = this.findSiblings( loop )
        , parentScope = parentElement.$$scope || this.rootScope
        , dataCollection = parentScope[ parentPropertyKey ]
        ;

      loop.originalHtml = loop.outerHTML;
      dataCollection.forEach( ( data, index ) => {
        const newElementNeeded = !siblingsArray[ index ]
          ;
        let targetLoop
          ;

        if ( newElementNeeded ) {
          targetLoop = loop.cloneNode( true );
        } else {
          targetLoop = siblingsArray[ index ]
        }
        targetLoop.$$scope = new Scope( localDataKey, data, parentScope, targetLoop, index );
        parentScope.addChildren( targetLoop.$$scope );
        parentElement.appendChild( targetLoop );

        targetLoop.$$scope.addEventListener( () => {
          this.parseElement( targetLoop, true );
          targetLoop.$$scope.deleteChangeFlag();
        } );
      } );

      // @todo: remove siblings if dataCollection.length < siblings.length
      const newSiblingArray = this.findSiblings( loop )
        ;

      newSiblingArray.forEach( ( element, index ) => {
        const shouldBeRemoved = index >= dataCollection.length
          ;

        if ( shouldBeRemoved ) {
          element.parentNode.removeChild( element );
        } else {
          this.parseElement( element );
        }
      } );

      this.parseLoops();
    }

    /**
     * Looks for element sibling
     * @param {Node} root
     * @return {NodeList}
     */
    findSiblings( root ) {
      return root.parentNode.querySelectorAll( ':scope > [lw-repeat]' );
    }

    /**
     * Returns first not parsed loop
     * @return {Element|null}
     */
    findNextLoopToParse() {
      const loops = this.getRootElement().querySelectorAll( '[lw-repeat]' )
        ;

      for ( const loop of loops ) {
        const hasScope = !!loop.$$scope
          , needUpdate = !hasScope || loop.$$scope.$$changed
          ;

        if ( needUpdate ) {
          return loop;
        }
      }

      return null;
    }

    /**
     * Parse element attributes and text
     * @param {Node} element
     * @param {boolean} [animation=false]
     */
    parseElement( element, animation = false ) {
      this.parseAttributes( element );
      this.parseText( element, animation );
    }

    /**
     * Evaluate element attributes in context of data
     * @param {Node} element
     */
    parseAttributes( element ) {
      const attributesArray = Array.from( element.attributes || [] )
        , hasAttributes = !!attributesArray.length
        ;
      if ( !hasAttributes ) {
        return;
      }

      attributesArray.forEach( attribute => {
        const hasOriginalValue = !!attribute.originalValue
          ;

        if ( !hasOriginalValue ) {
          attribute.originalValue = attribute.nodeValue; // @todo: add custom prefix
        }
        attribute.nodeValueOld = attribute.nodeValue;
        attribute.nodeValue = this.evalInScope( attribute.originalValue, element.$$scope ); // @todo: check if value changed
      } );
    }

    /**
     * Evaluate element text in context of data
     * @param {Node} element
     * @param {boolean} [animation]
     */
    parseText( element, animation = false ) {
      element.childNodes.forEach( node => {
        const isText = node.nodeType === 3
          ;

        if ( isText ) {
          const text = node.data
            , hasOriginalValue = !!node.stringToEval
            ;

          if ( !hasOriginalValue ) { // @todo: add custom prefix
            node.stringToEval = text;
          }
          node.oldData = node.data;
          const newData = this.evalInScope( node.stringToEval, element.$$scope ) // @todo: check if value changed
            ;

          if ( !animation ) {
            node.data = newData;
          } else {
            this.animateText( node, newData );
          }
        }
      } );
    }

    /**
     *
     * @param {text} textNode
     * @param {string} newText
     */
    animateText( textNode, newText ) {
      let index = 0
        , newTextLength = newText.length
        , oldTextLength = textNode.data.length
        , animationFrameTime = this.animationStep
        , currentTextAsArray = textNode.data.split( '' )
        ;

      clearInterval( textNode.$$animation );

      textNode.$$animation = setInterval( () => {
        const animationFinished = newTextLength === oldTextLength
          ;

        if ( animationFinished ) {
          clearInterval( textNode.$$animation );
        }

        currentTextAsArray[ index ] = newText[ index ] || '';

        textNode.data = currentTextAsArray.join( '' ); // @todo: request animation frame
        index++;
      }, animationFrameTime );
    }

    /**
     * Evaluates expression in context of scope data
     * @param {string} stringToEval=''
     * @param {Scope} scope
     * @return {*}
     */
    evalInScope( stringToEval = '', scope ) {
      const expressionPattern = /({{)([$_.a-zA-Z0-9]+)(}})/g
        ;

      return stringToEval.replace( expressionPattern, ( ...args ) => {
        const dataKey = args[ 2 ]
          , keysArray = dataKey.split( '.' )
          , scopeDataKey = keysArray[ 0 ]
          , remainingKeys = Array.from( keysArray ).splice( 1 )
          , dataContext = scope[ scopeDataKey ]
          , hasRemainingKeys = !!remainingKeys.length
          ;

        if ( hasRemainingKeys ) {
          return this.findInObject( remainingKeys, dataContext ) || '';
        } else {
          return dataContext || '';
        }
      } );
    }

    /**
     * Recursively traverse trough object based on keys
     * @param {Array} keysArray
     * @param {Object} object
     * @return {*}
     */
    findInObject( keysArray, object ) {
      const hasData = !!object
        , hasKeys = !!keysArray.length
        ;

      if ( !hasData || !hasKeys ) {
        return '';
      }
      const firstKey = keysArray[ 0 ]
        , remainingKeysArray = keysArray.splice( 1 )
        , hasMoreKeys = !!remainingKeysArray.length
        , newDataContext = object[ firstKey ]
        , isNewDataObject = typeof newDataContext === 'object'
        ;

      if ( hasMoreKeys && newDataContext && isNewDataObject ) {
        return this.findInObject( remainingKeysArray, newDataContext );
      } else if ( !hasMoreKeys ) {
        return newDataContext;
      } else {
        return '';
      }
    }

    /**
     * Returns row by index
     * @param {number} rowNumber
     * @return {*}
     */
    findRow( rowNumber ) {
      const rows = this.rootScope.$$childScopes
        ;

      return rows[ rowNumber ];
    }

    /**
     * Updates row
     * @param {number} rowNumber
     * @param {number} elementNumber
     * @param {Node} newElement
     */
    updateRow( { rowNumber, elementNumber, newElement, offset } ) { // @todo: offset
      const rowScope = this.findRow( rowNumber )
        , targetScope = rowScope.$$childScopes[ elementNumber ]
        ;
      // @todo: handle situation when element added in row in position which is empty/new => targetScope===undefined
      if ( newElement ) {
        this.updateInRow( targetScope, newElement );
      } else {
        this.deleteInRow( rowScope, elementNumber );
      }
    }

    /**
     * Updates row text
     * @param {Scope} targetScope={}
     * @param {Node} newElement
     */
    updateInRow( targetScope = {}, newElement ) {
      targetScope.element = Object.assign( {}, targetScope.element, newElement );
    }

    /**
     * Delete row text
     * @param rowScope
     * @param removeFrom
     */
    deleteInRow( rowScope, removeFrom ) {
      const childScopes = rowScope.$$childScopes
        ;

      for ( let i = removeFrom; i < childScopes.length; i++ ) {
        const targetScope = childScopes[ i ]
          ;

        this.updateInRow( targetScope, { text: '' } );
      }
    }

    /**
     * Returns new generator which iterates through all frames
     * @return {function*}
     */
    animationGenerator() {
      return function*( context ) {
        while ( context.keyframes.length ) {
          yield context.updateRow( context.keyframes.shift() );
        }
      }( this );
    }
  }

  /*
  Add class to global scope via l.wado property
   */
  const wasPublicObjectDeclared = 'l.wado' in window
    ;

  if ( !wasPublicObjectDeclared ) {
    window[ 'l.wado' ] = {};
  }

  window[ 'l.wado' ].Editor = Editor;
})( document, window );

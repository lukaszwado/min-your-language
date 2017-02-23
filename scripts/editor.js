/**
 * @author Lukasz
 * @date 17/02/2017.
 */
'use strict';

(function ( document, window ) {
  const Scope = window[ 'l.wado' ].Scope
    ;

  class Editor {
    /**
     * Code editor
     * @param {string} appName
     * @param {*} initialData
     * @param {Array} [keyframes]
     * @param {number} [animationDuration=50]
     */
    constructor( appName, initialData, keyframes, animationDuration = 50 ) {
      this.appName = appName;
      this.rootElement = document.querySelector( `[lw-app=${appName}]` );
      this.rootElement.$$scope = new Scope( appName, this.deepClone( initialData ) );
      this.rootScope = this.getRootElement().$$scope;
      this.animationStep = animationDuration;
      this.animationQueue = [];
      this.parseLoops();
      this.keyframes = keyframes;
    }

    /**
     * Creates deep clone of an Object
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
     * Recursively parses all lw-loops
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
        targetLoop.$$scope = new Scope( localDataKey, data, parentScope, index );
        parentScope.addChildren( targetLoop.$$scope );
        parentElement.appendChild( targetLoop );

        targetLoop.$$scope.addEventListener( () => {
          this.parseElement( targetLoop, true );
          targetLoop.$$scope.deleteChangeFlag();
        } );
      } );

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
     * Parses element attributes and text
     * @param {Node} element
     * @param {boolean} [animation=false]
     */
    parseElement( element, animation = false ) {
      this.parseAttributes( element );
      this.parseText( element, animation );
    }

    /**
     * Evaluates element attributes in context of data
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
        const hasOriginalValue = !!attribute.$$originalValue
          ;

        if ( !hasOriginalValue ) {
          attribute.$$originalValue = attribute.nodeValue;
        }
        attribute.nodeValueOld = attribute.nodeValue;
        const newVal = this.evalInScope( attribute.$$originalValue, element.$$scope )
          , valueChanged = newVal !== attribute.nodeValue
          ;

        if ( valueChanged ) {
          attribute.nodeValue = newVal;
        }
      } );
    }

    /**
     * Evaluates element text in context of data
     * @param {Node} element
     * @param {boolean} [animation]
     */
    parseText( element, animation = false ) {
      element.childNodes.forEach( node => {
        const isText = node.nodeType === 3
          ;

        if ( isText ) {
          const text = node.data
            , hasOriginalValue = !!node.$$stringToEval
            ;

          if ( !hasOriginalValue ) {
            node.$$stringToEval = text;
          }
          node.oldData = node.data;
          const newData = this.evalInScope( node.$$stringToEval, element.$$scope )
            , valueChanged = newData !== node.data
            ;

          if ( !valueChanged ) {
            return;
          }

          if ( !animation ) {
            node.data = newData;
          } else {
            this.animateText( node, newData );
          }
        }
      } );
    }

    /**
     * Animates text when updated, creates animation queue when animation in progress
     * @param {text} textNode
     * @param {string} newText
     */
    animateText( textNode, newText ) {
      let index = 0
        ;
      const animationFrameTime = this.animationStep
        , currentTextAsArray = textNode.data.split( '' )
        , animationQueEmpty = this.isAnimationQueueEmpty()
        ;

      this.animationQueue.push( () => {
        return new Promise( promiseExecutor );
      } );

      if ( animationQueEmpty ) {
        this.executeAnimationQueue();
      }

      function promiseExecutor( resolve ) {
        const interval = setInterval( () => {
          currentTextAsArray[ index ] = newText[ index ] || '';
          requestAnimationFrame( () => {
            const currentText = textNode.data = currentTextAsArray.join( '' )
              , animationFinished = newText === currentText
              ;

            if ( animationFinished ) {
              clearInterval( interval );
              resolve( true );
            }
          } );
          index++;
        }, animationFrameTime );
      }
    }

    /**
     * Returns information whether pending animation present in queue
     * @return {boolean}
     */
    isAnimationQueueEmpty() {
      return !this.animationQueue.length;
    }

    /**
     * Loops trough all elements in animation queue and executes animations in order
     */
    executeAnimationQueue() {
      if ( !this.isAnimationQueueEmpty() ) {
        const animationPromise = this.animationQueue[ 0 ]
          ;

        animationPromise().then( () => {
          this.animationQueue.shift();
          this.executeAnimationQueue();
        } );
      }
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
     * Recursively traverses trough object based on keys
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
     * @param {{[text],[type]}} newElement
     */
    updateRow( { rowNumber, elementNumber, newElement } ) {
      const rowScope = this.findRow( rowNumber )
        , targetScope = rowScope.$$childScopes[ elementNumber ]
        ;

      if ( newElement ) {
        this.updateInRow( targetScope, newElement );
      } else {
        this.deleteInRow( rowScope, elementNumber );
      }
    }

    /**
     * Updates row text
     * @param {{element}} targetScope={}
     * @param {{[text],[type]}} newElement
     */
    updateInRow( targetScope, newElement ) {
      targetScope.element = Object.assign( {}, targetScope.element, newElement );
    }

    /**
     * Deletes row text
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
     * @return {*}
     */
    * animationGenerator() {
      while ( this.keyframes.length ) {
        yield this.updateRow( this.keyframes.shift() );
      }
    }
  }

  /*
   Add class to global scope via l.wado property
   */
  const globalObjectInitialised = 'l.wado' in window
    ;

  if ( !globalObjectInitialised ) {
    window[ 'l.wado' ] = {};
  }

  window[ 'l.wado' ].Editor = Editor;
})( document, window );

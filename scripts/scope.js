/**
 * @author Lukasz
 * @date 19/02/2017.
 */

'use strict';

(function ( window ) {
  class Scope {
    constructor( dataName, data, parentScope, elementReference, index = null ) {
      this[ dataName ] = data; // data container
      this.$$parentScope = parentScope; // reference to parent source
      this.$$changed = false; // need update
      this.$$changeSource = void(0); // source of changes @todo: probably can be removed
      this.$$childScopes = []; // references to child scopes
      this.$$elementReference = elementReference; // reference to DOM node
      this.$$nonZeroIndex = index + 1;
      this.$$eventListeners = {};

      const scopeProxy = this.addChangeDetector()
        ;

      if ( parentScope ) {
        parentScope.$$childScopes[ index ] = scopeProxy;
      }

      return scopeProxy;
    }

    /**
     * Add event to scope "onchange"
     * @param callback
     */
    addEventListener( callback ) {
      const listenersInitialised = !!this.$$eventListeners.$$global
        ;

      if ( !listenersInitialised ) {
        this.$$eventListeners.$$global = [];
      }

      this.$$eventListeners.$$global.push( callback );
    }

    /**
     * Fire all global events
     */
    fireEvents() {
      const events = this.$$eventListeners.$$global
        , hasEvents = !!events
        ;

      if ( hasEvents ) {
        events.forEach( callback => {
          callback( this );
        } );
      }
    }

    /**
     * Wraps scope in "change detector"
     * @return {*}
     */
    addChangeDetector() {
      return new Proxy( this, {
        set( scope, property, value ){
          const valueChanged = scope[ property ] !== value
            , isPrivateProperty = property.indexOf( '$$' ) === 0
            ;

          if ( valueChanged ) {
            scope[ property ] = value;
          }
          if ( valueChanged && !isPrivateProperty ) {
            scope.setChangeFlag();
            scope.fireEvents( property );
          }
          return true;
        }
      } );
    }

    /**
     * Recursively set changed flag for all parents up to top
     * @param changeSource
     */
    setChangeFlag( changeSource ) {
      this.$$changed = true;
      // this.$$changeSource = changeSource || this;
      // if ( this.$$parentScope ) {
      //   this.$$parentScope.setChangeFlag( this );
      // }
    }

    /**
     * Remove $$changed flag from scope
     */
    deleteChangeFlag() {
      this.$$changed = false;
      // this.$$changeSource = null;
    }

    /**
     * Add children to scope
     * @param {*} child
     */
    addChildren( child ) {
      this.$$childScopes.push( child );
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

  window[ 'l.wado' ].Scope = Scope;
})( window );

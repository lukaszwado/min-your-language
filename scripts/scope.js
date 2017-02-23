/**
 * @author Lukasz
 * @date 19/02/2017.
 */

'use strict';

(function ( window ) {
  /**
   * $$ prefixed used to distinguish scopes private properties (thanks Angular)
   */
  class Scope {
    /**
     * Creates new data scope
     * @param {string} dataName
     * @param {*} data
     * @param {Scope|null} [parentScope]
     * @param {number|null} [index=null]
     * @return {*}
     */
    constructor( dataName, data, parentScope = null, index = null ) {
      this[ dataName ] = data; // data container
      this.$$changed = false; // need update
      this.$$childScopes = []; // references to child scopes
      this.$$eventListeners = {};
      this.$$nonZeroIndex = index + 1; // index of loop + 1

      const scopeProxy = this.addChangeDetector()
        ;

      if ( parentScope ) {
        parentScope.$$childScopes[ index ] = scopeProxy;
      }

      return scopeProxy;
    }

    /**
     * Add listener to scopes "onchange" event
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
     * Fires all global events
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
     * Sets changed flag for current scope
     */
    setChangeFlag() {
      this.$$changed = true;
    }

    /**
     * Removes $$changed flag from scope
     */
    deleteChangeFlag() {
      this.$$changed = false;
      // this.$$changeSource = null;
    }

    /**
     * Adds children to scope
     * @param {*} child
     */
    addChildren( child ) {
      this.$$childScopes.push( child );
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

  window[ 'l.wado' ].Scope = Scope;
})( window );

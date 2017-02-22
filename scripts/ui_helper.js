/**
 * @author Lukasz
 * @date 22/02/2017.
 */

'use strict';

(function ( document, window ) {

  class UiHelper {
    constructor( editorReference ) {
      this.editorVisible = false;
      this.mainContainer = document.querySelector( '.lw-layout__main-container' );
      this.codeContainer = this.mainContainer.querySelector( '.lw-layout__code-container' );
      this.mainContainerHeight = this.getMainContainerHeight();
      this.notification = document.querySelector( '.lw-layout__notification' );
      this.prevScroll = null;
      this.currentAnimationFrame = null;
      this.animationGenerator = editorReference.animationGenerator()
    }

    /**
     * Displays information in notification section
     * @param {string} message
     * @param {boolean} [visible]
     */
    toggleNotification( message, visible = false ) {
      this.notification.innerText = message;
      this.notification.style.display = visible ? 'block' : 'none';
    }

    /**
     * Returns content height
     * @return {number}
     */
    getMainContainerHeight() {
      return this.mainContainer.clientHeight;
    }

    /**
     * Extends container height to provide infinite scroll
     * @param {number} windowScroll
     */
    extendContainerHeight( windowScroll ) {
      this.mainContainer.style.height = this.mainContainerHeight + windowScroll + 'px';
    }

    /**
     * Displays the content containing editor
     * @param windowScroll
     */
    showContent( windowScroll ) {
      const showContent = !this.editorVisible && windowScroll > 50
        ;

      if ( showContent ) {
        this.codeContainer.classList.add( 'lw-layout__code-container--visible' );
        this.editorVisible = true;
      }
    }

    /**
     * Updates the editor view with new frame content
     * @param {number} currentStep
     * @return {boolean}
     */
    goToNextFrame( currentStep ) {
      const lastFrameReached = !!this.animationGenerator.next().done
        ;

      this.currentAnimationFrame = currentStep;
      return lastFrameReached;
    }

    /**
     * Destroys event bound to window scroll
     */
    destroyScrollEvent() {
      window.removeEventListener( 'scroll', this.scrollAnimationFunction );
    }

    /**
     * Factory function return scroll listener function with context of the class
     * @return {(function(this:UiHelper))|*}
     */
    scrollAnimationFactory() {
      this.scrollAnimationFunction = function () {
        const windowScroll = window.scrollY
          , currentStep = ~~(windowScroll / 150)
          , updateNeeded = this.currentAnimationFrame < currentStep
          , scrollingBackwards = this.prevScroll > windowScroll
          ;

        this.prevScroll = windowScroll;

        this.showContent( windowScroll );

        let lastFrame = false
          ;

        if ( updateNeeded ) {
          lastFrame = this.goToNextFrame( currentStep );
        }
        if ( scrollingBackwards ) {
          this.currentAnimationFrame = currentStep;
          this.toggleNotification( 'There is no way back!', true );
        } else {
          this.toggleNotification( '', false );
        }

        if ( lastFrame ) {
          this.destroyScrollEvent();
        } else {
          this.extendContainerHeight( windowScroll );
        }
      }.bind( this );

      return this.scrollAnimationFunction;
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

  window[ 'l.wado' ].UiHelper = UiHelper;

})( document, window );
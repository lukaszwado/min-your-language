/**
 * @author Lukasz
 * @date 22/02/2017.
 */

'use strict';

(function ( document, window ) {

  class UiHelper {
    /**
     * Contains all UI related methods
     * @param {Editor} editorReference
     */
    constructor( editorReference ) {
      this.mainContainer = document.querySelector( '.lw-layout__main-container' );
      this.codeContainer = this.mainContainer.querySelector( '.lw-layout__code-container' );
      this.notification = document.querySelector( '.lw-layout__notification' );
      this.footer = document.querySelector( '.lw-layout__footer' );
      this.background = document.querySelector( '.lw-layout__background' );
      this.mainContainerHeight = this.getMainContainerHeight();
      this.animationGenerator = editorReference.animationGenerator();
      this.animationQueueChecker = editorReference.isAnimationQueueEmpty.bind( editorReference );
      this.prevScroll = null;
      this.editorVisible = false;
      this.currentAnimationFrame = null;
      this.lastFrame = false;
      this.documentElement = document.documentElement;
      this.body = document.body;
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
      const shouldBeVisible = windowScroll > 50
        , showContent = !this.editorVisible && shouldBeVisible
        ;

      if ( showContent ) {
        this.codeContainer.classList.add( 'lw-layout__code-container--visible' );
        this.editorVisible = true;
      } else if ( !shouldBeVisible ) {
        this.codeContainer.classList.remove( 'lw-layout__code-container--visible' );
        this.editorVisible = false;
      }
    }

    /**
     * Updates the editor view with new frame content
     * @param {number} currentStep
     * @return {boolean}
     */
    goToNextFrame( currentStep ) {
      const lastFrameReached = this.animationGenerator.next().done
        ;
      this.currentAnimationFrame = currentStep;
      return lastFrameReached;
    }

    /**
     * Factory function returns scroll listener function in context of the class
     * @param {number} [step=150]
     * @return {(function(this:UiHelper))|*}
     */
    scrollAnimationFactory( step = 150 ) {
      return () => {
        const windowScroll = window.scrollY
          , currentStep = ~~(windowScroll / step)
          , updateNeeded = this.currentAnimationFrame < currentStep
          , scrollingBackwards = this.prevScroll > windowScroll
          , animationQueueEmpty = this.animationQueueChecker()
          ;

        this.prevScroll = windowScroll;

        this.showContent( windowScroll );

        if ( updateNeeded ) {
          this.lastFrame = this.goToNextFrame( currentStep );
        }
        if ( scrollingBackwards ) {
          this.currentAnimationFrame = currentStep;
          this.toggleNotification( 'There is no way back!', true );
        } else {
          this.toggleNotification( '', false );
        }

        if ( !this.lastFrame || !animationQueueEmpty ) {
          this.extendContainerHeight( windowScroll );
        } else {
          this.footer.classList.add( 'lw-layout__footer--visible' );
        }
      };
    }

    backgroundMove() {
      const mousePositionX = event.screenX
        , mousePositionY = event.screenY
        , documentWidth = this.documentElement.clientWidth
        , documentHeight = this.documentElement.clientHeight
        , backgroundOffsetX = ~~( ( mousePositionX - documentWidth / 2 ) / documentWidth * 50)
        , backgroundOffsetY = ~~( ( mousePositionY - documentHeight / 2 ) / documentHeight * 50)
        ;

      this.background.style.transform = `translate(${backgroundOffsetX}px, ${backgroundOffsetY}px)`;
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

  window[ 'l.wado' ].UiHelper = UiHelper;

})( document, window );
/**
 * @author Lukasz
 * @date 16/02/2017.
 */
'use strict';

(function ( rows, keyframes ) {
  const Editor = window[ 'l.wado' ].Editor
    , editor = new Editor( 'lwEditor', rows, 50, keyframes )
    , defaultEditor = new Editor( 'lwEditorDefault', rows )
    , animationGenerator = editor.animationGenerator()
    , mainContainer = document.querySelector( '.lw-layout__main-container' )
    , mainContainerHeight = mainContainer.clientHeight
    , codeContainer = mainContainer.querySelector( '.lw-layout__code-container' )
    , notification = document.querySelector( '.lw-layout__notification' )
    ;

  window.addEventListener( 'beforeunload', () => {
    window.scrollTo( 0, 0 ); // @todo: add this to on load event
  } );

  window.addEventListener( 'scroll', animateOnScroll );

  let animationFrame = null
    , prevScroll = null
    ;


  function animateOnScroll() {
    const windowScroll = window.scrollY
      , currentStep = ~~(windowScroll / 150)
      , updateNeeded = animationFrame < currentStep
      , scrollingBackwards = prevScroll > windowScroll
      ;

    prevScroll = windowScroll;

    toggleEditors( windowScroll );

    let lastFrame = false
      ;

    if ( updateNeeded ) {
      lastFrame = goToNextFrame( currentStep );
    }
    if ( lastFrame ) {
      destroyScrollEvent();
    } else {
      extendContainerHeight( windowScroll );
    }
    if ( scrollingBackwards ) {
      animationFrame = currentStep;
      toggleInfo( 'There is no way back!', true );
    } else {
      toggleInfo( '', false );
    }
  }

  function toggleInfo( message, visible ) {
    notification.innerText = message;
    notification.style.display = visible ? 'block' : 'none';
  }


  function goToNextFrame( currentStep ) {
    animationFrame = currentStep;
    return !!animationGenerator.next().done;
  }

  function extendContainerHeight( scrollY ) {
    mainContainer.style.height = mainContainerHeight + scrollY + 'px';
  }

  function destroyScrollEvent() {
    window.removeEventListener( 'scroll', animateOnScroll );
  }

  function toggleEditors( windowScroll ) {
    const shouldBeVisible = windowScroll > 50
      ;
    if ( shouldBeVisible ) {
      codeContainer.classList.add( 'lw-layout__code-container--visible' );
    } else {
      codeContainer.classList.remove( 'lw-layout__code-container--visible' );
    }

  }

  /*
   Don't do that at home
   */
  // eval( editor.getRootElement().innerText ); @todo: write safe eval in worker?
})( data, animationKeyframes );
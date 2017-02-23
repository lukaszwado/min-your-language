/**
 * @author Lukasz
 * @date 16/02/2017.
 */
'use strict';

(function ( rows, keyframes ) {
  const appGlobalObject = window[ 'l.wado' ]
    , Editor = appGlobalObject.Editor
    , editor = new Editor( 'lwEditor', rows, keyframes, 30 )
    , defaultEditor = new Editor( 'lwEditorDefault', rows )
    , UiHelper = appGlobalObject.UiHelper
    , uiHelper = new UiHelper( editor )
    ;

  /*
   Scroll to top before user leave the page to force saving scroll position by some browsers
   */
  window.addEventListener( 'beforeunload', () => {
    window.scrollTo( 0, 0 );
  } );
  /*
   Animate the editor on scroll
   */
  window.addEventListener( 'scroll', uiHelper.scrollAnimationFactory( 150 ) );
  /*
   Move the background against cursor position
   */
  let counter = 0
    ;
  window.addEventListener( 'mousemove', ( event ) => {
    const throttle = counter !== 5
      ;
    if ( !throttle ) {
      uiHelper.backgroundMove( event );
      counter = 0;
    } else {
      counter++;
    }
  } );
})( data, animationKeyframes );
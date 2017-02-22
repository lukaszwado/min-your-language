/**
 * @author Lukasz
 * @date 16/02/2017.
 */
'use strict';

(function ( rows, keyframes ) {
  const Editor = window[ 'l.wado' ].Editor
    , editor = new Editor( 'lwEditor', rows, 50, keyframes )
    , defaultEditor = new Editor( 'lwEditorDefault', rows )
    , UiHelper = window[ 'l.wado' ].UiHelper
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
  window.addEventListener( 'scroll', uiHelper.scrollAnimationFactory() );

  /*
   Don't do that at home used only to test code correctness
   */
  // eval( editor.getRootElement().innerText ); @todo: write safe eval in a web worker?
})( data, animationKeyframes );
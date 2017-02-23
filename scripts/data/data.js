/**
 * @author Lukasz
 * @date 17/02/2017.
 */

'use strict';

const data = [];

data.push( [ {
  text: 'const',
  type: 'keyword'
}, {
  text: 'arr1',
  type: 'var-name'
}, {
  text: '=',
  type: 'default'
}, {
  text: '[',
  type: 'object'
}, {
  text: '1, -2, 3, -4, 5',
  type: 'default  '
}, {
  text: ']',
  type: 'object'
} ] );

data.push( [ {
  text: ',',
  type: 'tr-comma'
}, {
  text: 'arr2',
  type: 'var-name'
}, {
  text: '=',
  type: 'default'
}, {
  text: '[]',
  type: 'object'
} ] );

data.push( [ {
  text: ',',
  type: 'tr-comma'
}, {
  text: 'arr3',
  type: 'var-name'
}, {
  text: '=',
  type: 'default'
}, {
  text: '[]',
  type: 'object'
} ] );

data.push( [ {
  text: ',',
  type: 'tr-comma'
}, {
  text: 'y',
  type: 'var-name'
}, {
  text: '=',
  type: 'default'
}, {
  text: '2',
  type: 'default'
} ] );

data.push( [ {
  text: ';',
  type: 'tr-comma'
} ] );

data.push( [ {} ] );

data.push( [ {
  text: 'for',
  type: 'keyword'
}, {
  text: '(',
  type: 'default'
}, {
  text: 'let',
  type: 'keyword'
}, {
  text: 'i',
  type: 'var-name'
}, {
  text: '=',
  type: 'default'
}, {
  text: '0',
  type: 'default'
}, {
  text: ';',
  type: 'sticky'
}, {
  text: 'i',
  type: 'var-name'
}, {
  text: '<',
  type: 'default'
}, {
  text: 'arr1',
  type: 'var-name'
}, {
  text: '.length',
  type: 'method'
}, {
  text: ';',
  type: 'sticky'
}, {
  text: 'i++',
  type: 'var-name'
}, {
  text: '){',
  type: 'default'
} ] );

data.push( [ {
  text: 'if',
  type: 'keyword'
}, {
  text: '(',
  type: 'default'
}, {
  text: 'arr1',
  type: 'var-name'
}, {
  text: '[',
  type: 'method'
}, {
  text: 'i',
  type: 'var-name'
}, {
  text: ']',
  type: 'method--close'
}, {
  text: '>=',
  type: 'default'
}, {
  text: `y`,
  type: 'var-name'
}, {
  text: '){',
  type: 'default'
} ] );

data.push( [ {
  text: 'arr2',
  type: 'var-name'
}, {
  text: '.push(',
  type: 'method'
}, {
  text: 'arr1',
  type: 'var-name'
}, {
  text: '[',
  type: 'method'
}, {
  text: 'i',
  type: 'var-name'
}, {
  text: ']',
  type: 'method--close'
}, {
  text: ')',
  type: 'method--close'
}, {
  text: ';',
  type: 'sticky'
} ] );

data.push( [ {
  text: '}',
  type: 'default'
}, {
  text: 'else',
  type: 'keyword'
}, {
  text: '{',
  type: 'default'
} ] );

data.push( [ {
  text: 'arr3',
  type: 'var-name'
}, {
  text: '.push(',
  type: 'method'
}, {
  text: 'arr1',
  type: 'var-name'
}, {
  text: '[',
  type: 'method'
}, {
  text: 'i',
  type: 'var-name'
}, {
  text: ']',
  type: 'method--close'
}, {
  text: ')',
  type: 'method--close'
}, {
  text: ';',
  type: 'sticky'
} ] );


data.push( [ {
  text: '}',
  type: 'default'
} ] );


data.push( [ {
  text: '}',
  type: 'default'
} ] );

data.push( [ {}, {}, {}, {}, {} ] );

data.push( [ {
  text: 'console',
  type: 'global'
}, {
  text: '.log(',
  type: 'method'
}, {
  text: 'arr2',
  type: 'var-name'
}, {
  text: ',',
  type: 'default'
}, {
  text: 'arr3',
  type: 'var-name'
}, {
  text: ')',
  type: 'method--close'
}, {
  text: ';',
  type: 'sticky'
} ] );

data.push( [ {} ] );

data[ 1 ].indent = 1;
data[ 2 ].indent = 1;
data[ 3 ].indent = 1;
data[ 4 ].indent = 1;
data[ 7 ].indent = 1;
data[ 8 ].indent = 2;
data[ 9 ].indent = 1;
data[ 10 ].indent = 2;
data[ 11 ].indent = 1;

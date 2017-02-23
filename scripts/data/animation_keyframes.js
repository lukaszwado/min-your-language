/**
 * @author Lukasz
 * @date 19/02/2017.
 */

'use strict';

const animationKeyframes = [
  {
    rowNumber: 0,
    elementNumber: 1,
    newElement: { text: 'numbersToAssign' }
  },
  {
    rowNumber: 6,
    elementNumber: 9,
    newElement: { text: 'numbersToAssign' }
  },
  {
    rowNumber: 7,
    elementNumber: 2,
    newElement: { text: 'numbersToAssign' }
  },
  {
    rowNumber: 8,
    elementNumber: 2,
    newElement: { text: 'numbersToAssign' }
  },
  {
    rowNumber: 10,
    elementNumber: 2,
    newElement: { text: 'numbersToAssign' }
  },
  {
    rowNumber: 3,
    elementNumber: 1,
    newElement: { text: 'THRESHOLD' }
  },
  {
    rowNumber: 7,
    elementNumber: 7,
    newElement: { text: 'THRESHOLD' }
  },
  {
    rowNumber: 1,
    elementNumber: 1,
    newElement: { text: 'overThreshold' }
  },
  {
    rowNumber: 8,
    elementNumber: 0,
    newElement: { text: 'overThreshold' }
  },
  {
    rowNumber: 14,
    elementNumber: 2,
    newElement: { text: 'overThreshold' }
  },
  {
    rowNumber: 2,
    elementNumber: 1,
    newElement: { text: 'withinThreshold' }
  },
  {
    rowNumber: 10,
    elementNumber: 0,
    newElement: { text: 'withinThreshold' }
  },
  {
    rowNumber: 14,
    elementNumber: 4,
    newElement: { text: 'withinThreshold' }
  },
  {
    rowNumber: 6,
    elementNumber: 0,
    newElement: { text: 'function' }
  },
  {
    rowNumber: 6,
    elementNumber: 1,
    newElement: { text: 'assignNumber(' }
  },
  {
    rowNumber: 6,
    elementNumber: 2,
    newElement: { text: 'number', type: 'var-name' }
  },
  {
    rowNumber: 6,
    elementNumber: 3,
    newElement: { text: '){', type: 'default' }
  },
  {
    rowNumber: 6,
    elementNumber: 4
  },
  {
    rowNumber: 7,
    elementNumber: 2,
    newElement: { text: 'number' }
  },
  {
    rowNumber: 7,
    elementNumber: 3,
    newElement: { text: '>=', type: 'default' }
  },
  {
    rowNumber: 7,
    elementNumber: 4,
    newElement: { text: 'THRESHOLD' }
  },
  {
    rowNumber: 7,
    elementNumber: 5,
    newElement: { text: '){', type: 'default' }
  },
  {
    rowNumber: 7,
    elementNumber: 6
  },
  {
    rowNumber: 8,
    elementNumber: 2,
    newElement: { text: 'number' }
  },
  {
    rowNumber: 8,
    elementNumber: 3,
    newElement: { text: ')', type: 'method--close' }
  },
  {
    rowNumber: 8,
    elementNumber: 4,
    newElement: { text: ';', type: 'sticky' }
  },
  {
    rowNumber: 8,
    elementNumber: 5,
  },
  {
    rowNumber: 10,
    elementNumber: 2,
    newElement: { text: 'number' }
  },
  {
    rowNumber: 10,
    elementNumber: 3,
    newElement: { text: ')', type: 'method--close' }
  },
  {
    rowNumber: 10,
    elementNumber: 4,
    newElement: { text: ';', type: 'sticky' }
  },
  {
    rowNumber: 10,
    elementNumber: 5,
  },
  {
    rowNumber: 13,
    elementNumber: 0,
    newElement: { text: 'numbersToAssign', type: 'var-name' }
  },
  {
    rowNumber: 13,
    elementNumber: 1,
    newElement: { text: '.forEach(', type: 'method' }
  },
  {
    rowNumber: 13,
    elementNumber: 2,
    newElement: { text: 'assignNumber', type: 'default' }
  },
  {
    rowNumber: 13,
    elementNumber: 3,
    newElement: { text: ')', type: 'method--close' }
  },
  {
    rowNumber: 13,
    elementNumber: 4,
    newElement: { text: ';', type: 'sticky' }
  },
];
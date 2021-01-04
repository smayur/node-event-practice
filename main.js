const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

myEmitter.on('event', () => {
  console.log('an event occurred!');
});
myEmitter.emit('event');


/*********** Passing arguments and this to listeners ***********/

myEmitter.on('param', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // Prints:
  // a b MyEmitter {
  //   _events: [Object: null prototype] { event: [Function], param: [Function] },
  //   _eventsCount: 2,
  //   _maxListeners: undefined,
  //   [Symbol(kCapture)]: false
  // } true
});
myEmitter.emit('param', 'a', 'b');


/*********** Using arrow function ***********/ 

myEmitter.on('param', (a, b) => {
  console.log(a, b, this, this === myEmitter);            // a b MyEmitter {} false
});
myEmitter.emit('param', 'a', 'b');
const EventEmitter = require('events');
const net = require("net");

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const server = net.createServer().listen(8081, "127.0.0.1");

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


/*********** Using arrow function ***********/ 

myEmitter.on('param', (a, b) => {
  console.log(a, b, this, this === myEmitter);            // a b MyEmitter {} false
});

// myEmitter.emit('param', 'a', 'b');


/*********** Asynchronous ***********/ 

myEmitter.on('param', (a, b) => {
  
  setImmediate(() => {
    console.log('this happens asynchronously');
  });
  
});
myEmitter.emit('param', 'a', 'b');


/*********** Server ***********/ 

server.on("listening", () => {
  console.log("Server listening!");
});

server.on("connection", (socket) => {
  console.log("Client connected!");
  socket.end("Hi Mayur");  
});

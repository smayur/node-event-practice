const EventEmitter = require('events');
const net = require("net");
const fs = require("fs");
const circle = require('./circle.js');

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

myEmitter.emit('param', 'a', 'b');


/*********** Server ***********/ 

server.on("listening", () => {
  console.log("Server listening!");
});

server.on("connection", (socket) => {
  console.log("Client connected!");
  socket.end("Hi Mayur");  
});


/*********** Blocking, synchronous way ***********/ 

const textIn = fs.readFileSync('./input.txt', 'utf-8');
console.log(textIn);
const textOut = `This is what we know about Synch: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync('./output.txt', textOut);
console.log("File written");

/*********** Non Blocking, Asynchronous way ***********/ 

fs.readFile('./input.txt', 'utf-8', (err, data) => {
  if (err) console.log(err);
  console.log(data);
  fs.writeFile('./output.txt', data, 'utf-8', err => {
    console.log("Output.txt fle has been updated");    
  });
});

console.log("Will read file!!...");


/*********** Promises ***********/ 
// The Promise object represents the eventual 
// completion (or failure) of an asynchronous operation and its resulting value.

const promise = new Promise((resolve, reject) => {
  fs.readFile('./input.txt', 'utf-8', (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});

promise.then(data => {
  fs.writeFile('./output.txt', data, 'utf-8', err => {
    if (err) console.log(err);
    console.log("Output.txt file has been updated");    
  });
}).catch(err => {
  console.log("Found error!!!"+err);    
});


console.log("Will read the file 2nd time!!...");


/*********** Modules ***********/ 
console.log(`The area of a circle of radius 4 is ${circle.area(4)}`);
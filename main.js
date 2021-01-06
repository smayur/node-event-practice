const EventEmitter = require('events');
const net = require("net");
const fs = require("fs");
const circle = require('./circle');

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

/* 
In the Node.js module system, each file is treated as a separate module.

When a file is run directly from Node.js, require.main is set to its module. 
That means that it is possible to determine whether a file has been run directly 
by testing require.main === module. 

For a file main.js, this will be true if run via node mian.js, but false if run by require('./main').

**-- The .mjs extension
  It is not possible to require() files that have the .mjs extension.
  Attempting to do so will throw an error. (Must use import to load ES Module)

  Careful planning is required to allow cyclic module dependencies to work correctly within an application.

**-- File modules

  If the exact filename is not found, then Node.js will attempt to load the required filename 
  with the added extensions: .js, .json, and finally .node.

  A required module prefixed with '/' is an absolute path to the file. 
  For example, require('/home/marco/foo.js') will load the file at /home/marco/foo.js.

  A required module prefixed with './' is relative to the file calling require(). 
  That is, circle.js must be in the same directory as foo.js for require('./circle') to find it.

  Without a leading '/', './', or '../' to indicate a file, 
  the module must either be a core module or is loaded from a node_modules folder.

  If the given path does not exist, require() will throw an Error with its code property set to 'MODULE_NOT_FOUND'.

**--The module wrapper
  Before a module's code is executed, Node.js will wrap it with a function wrapper that looks like the following:

  (function(exports, require, module, __filename, __dirname) {
    // Module code actually lives in here
  });

  By doing this, Node.js achieves a few things:

  - It keeps top-level variables (defined with var, const or let) scoped to the module rather than the global object.
  - It helps to provide some global-looking variables that are actually specific to the module, such as:
      - The module and exports objects that the implementor can use to export values from the module.
      - The convenience variables __filename and __dirname, containing the module's absolute filename and directory path.
*/


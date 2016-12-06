
let path = require("path");
let url = require("url");
let fs = require("fs");

exports.getFilePath = getFilePath = (page) => {
  var pathname = url.parse(page).pathname;
  var filepath = path.join(__dirname, "../web/" + pathname);

  return filepath;
};

// Earlier we refactored the loadFile to be a synchronous file loader, but that is a terrible
//  idea for any Node application.  Everything needs to be async, but because we had broken
//  everything into functions, mimiing a synchronous flow, it was easier.  This time around we
//  re-refactor loadFile to be async in an idiomatic ES6 way.
//
// ES6 provides us with the concept of Promises.  A Promise is simply a promise that some unit
//  of work will eventually complete (successfully or otherwise).  We have to convert LoadFile
//  to return a promise that can be used later.  The below code demonstrates the change:
//
exports.loadFile = loadFile = (filepath) => {
  let promise = new Promise((resolve, reject) => {
    fs.readFile(filepath, (error, data) => {
      if (error) {
        reject(error); // <-- when there's an error
      }
      else {
        resolve(data); // <-- when there's a success
      }
    });
  });

  return promise;
};

// When consuming an asynchronous function as a Promise, we simply invoke the function and then
//  continue with .then( { ... } ) and .catch( { ... } ) to handle errors.  Here the logical flow
//  is:
//
//  {
//    getFilePath( <from url> );
//    loadFile( <from path> );
//    sendResponse(...);
//  }
//
// Using a Promise we have to change the flow to
//
// {
//   getFilePath( <from url> );
//   loadFile( <from path> )  [ is async ] when completes =>  {
//     sendResponse(...);
//   }
// }
//
// We cannot accidentally sendResponse() after loadFile(), but outside of any callback/continuation or
//  the app will not behave correctly.  The remainder of the logical flow must complete in the .then()
//  sequence.
//
exports.sendFileResponse = sendFileResponse = (request, response, page, contentType, status) => {
  let path = getFilePath(page);

  loadFile(path)
    .then((content) => {
      sendResponse(request, response, content, contentType, status);
    })

    .catch((error) => {
      console.log(error);
    });
};

exports.sendResponse = sendResponse = (request, response, content, contentType, status) => {
  status = status || 200;

  response.writeHead(status, { "Content-Type": contentType });
  response.write(content, "utf8");
  response.end();
};

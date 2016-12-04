
let http = require("http");
let fs = require("fs");
let path = require("path");
let url = require("url");


// This to yourself, what are the steps we want to modularize?
//
// ...
//
// Incoming Request
//  If (valid url)
//    convert url to file system address
//    load file
//    send response with contents of file
//
//  else
//    respond with 404 not found
//
//  <sendResponse might be in common>
//
//
// Each of these steps appear to be resuable for many requests.  That is what
//  we'll attempt to refactor.
//

// NOTE: for demonstration purposes, some of the file handlers are asynchronous and others
//  synchronous.  There's no other technical reason why they are one way or the other. In
//  general, they should always be asynchronous unless there's a very compelling reason to
//  do otherwise.
//

// NOTE: The below code is an example of how one might handle incoming requests without
//  modularization.  Modularization is when we break the code into re-usable functions
//  and/or node modules (files).
//

// First refactor pass:
//
//  We notice a few parts that are repeated.
//
//   1: Converting the request.url into a file system path
//   2: Invalid url/filepath, return an error
//   3: Reading a file
//   4: Response with the file content
//
//  Each of those can be excellent candidates to write into a separate function
//
/*
var server = http.createServer(function (request, response) {
  console.log("request at: " + request.method + " url: " + request.url);

  if (request.method === "GET") {
    if (request.url === "/" || request.url === "/index.html") {
      var addy = (request.url === "/") ? "/index.html" : request.url;         : 1
      var filename = path.join(__dirname, "../web/" + addy);                  : 1

      fs.readFile(filename, "utf8", function (err, data) {                    : 3
        if (err) {
          response.writeHead(404);                                            : 2
          response.end(JSON.stringify(err));                                  : 2
        }
        else {
          var content = data.toString();

          response.writeHead(200, {"Content-Type": "text/html"});             : 4
          response.write(content, "utf-8");                                   : 4
          response.end();                                                     : 4
        }
      });
    }
  }
});

// NOTE: content was converted to a string, but that won't work if
//  loading an image or binary/non-text file.
*/

// NOTE: module.exports is only there so the unit tests can successfully run.  There is
//  no other technical reason to include it.
//

let server = exports.server = http.createServer((request, response) => {
  console.log(`${request.method} ${request.url}`);

  if (request.method === "GET") {
    let pathname = (request.url === "/" ? "/index.html" : url.parse(request.url).pathname);

    // NOTE: this could be an if {...} else {...} also.  Using switch here is cleaner and
    //  shows an alternate way to accomplish it.  In production you would not want to use
    //  a switch statement for serving up all possible files, as you'll learn in module-3.
    //
    switch (pathname) {
      case "/index.html":
        sendFileResponse(request, response, pathname, "text/html", 200);
        break;

      case "/about.html":
        sendFileResponse(request, response, pathname, "text/html", 200);
        break;

      case "/contact.html":
        sendFileResponse(request, response, pathname, "text/html", 200);
        break;

      case "/style.css":
        sendFileResponse(request, response, pathname, "text/css", 200);
        break;

      case "/scripts.js":
        sendFileResponse(request, response, pathname, "application/javascript", 200);
        break;

      default:
        sendResponse(request, response, "Not found", "text/html", 404);
        break;
    }
  }

  else if (request.method === "POST") {
    let data = "";

    request.on("data", function(chunk) {
      data += chunk;
    });

    request.on("end", function() {
      let contentType = (request.contentType || "text/plain");

      response.setHeader("content-Type", contentType);
      response.end(data, 200);
    })
  }

  else {
    response.writeHead(405);
    response.end("Method not allowed.", "");
  }
});

let port = process.env.PORT || 3000;
server.listen(port);

console.log(`Server running at http://127.0.0.1:${port}/`);



// From (1) above
//
function getFilePath(page) {
  let pathname = url.parse(page).pathname;
  let filepath = path.join(__dirname, "../web/" + pathname);

  return filepath;
}

// From (3) above
//
function loadFile(filepath) {
  let content = fs.readFileSync(filepath, "utf8");
  return content;
}

// From (4) above
//
//  NOTE: because we might send other type of response without a file (such as 404)
//   we broke out a generic sendResponse and a specialized sendFileResponse to handle
//   each case.
//
function sendFileResponse(request, response, page, contentType, status) {
  let path = getFilePath(page);
  let content = loadFile(path);

  sendResponse(request, response, content, contentType, status);
}

// Also from (4) above
//
function sendResponse(request, response, content, contentType, status) {
  status = status || 200;

  response.writeHead(status, { "Content-Type": contentType });
  response.write(content, "utf8");
  response.end();
}
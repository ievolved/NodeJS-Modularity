
let http = require("http");
let url = require("url");

let helpers = require("./request-helpers.js");


let routes = {
  "/index.html": [ helpers.sendFileResponse, "text/html" ],
  "/about.html": [ helpers.sendFileResponse, "text/html"],
  "/contact.html": [ helpers.sendFileResponse, "text/html" ],
  "/style.css": [ helpers.sendFileResponse, "text/css" ],
  "/scripts.js": [ helpers.sendFileResponse, "application/javascript" ]
};

let server = exports.server = http.createServer((request, response) => {
  console.log(`${request.method} ${request.url}`);

  if (request.method === "GET") {
    let pathname = (request.url === "/" ? "/index.html" : url.parse(request.url).pathname);

    let route = routes[pathname];
    if (route) {
      route[0](request, response, pathname, route[1], 200);
    }
    else {
      sendResponse(request, response, "Not found", "text/html", 404);

    }
  }

  else if (request.method === "POST") {
    let data = "";

    request.on("data", (chunk) => {
      data += chunk;
    });

    request.on("end", () => {
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

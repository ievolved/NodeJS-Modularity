
var path = require("path");
var url = require("url");
var fs = require("fs");


// What is the pattern: exports.getFilePath = getFilepath = function(...) {...} ??
//
//   var getFilePath would be a private variable if not assigned to exports.  Otherwise
//   exports.getFilePath would be the same as local.  Other functions that needed to call
//   getFilePath would have to use `getFilePath` even if in the same file.  To define both
//   an export and a local variable, we use the x = y = function() syntax where one is
//   the export and the other is the local private (to eliminate the "export." part when
//   calling local).
//

exports.getFilePath = getFilePath = function(page) {
  var uri = url.parse(page).pathname;
  var filepath = path.join(__dirname, "../web/" + uri);

  return filepath;
};

exports.loadFile = loadFile = function(filepath) {
  var content = fs.readFileSync(filepath, "utf8");
  return content;
};

exports.sendFileResponse = sendFileResponse = function (request, response, page, contentType, status) {
  var path = getFilePath(page);
  var content = loadFile(path);

  sendResponse(request, response, content, contentType, status);
};

exports.sendResponse = sendResponse = function (request, response, content, contentType, status) {
  status = status || 200;

  response.writeHead(status, { "Content-Type": contentType });
  response.write(content, "utf8");
  response.end();
};

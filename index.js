console.log("index");

var http = require("http");
var fs = require("fs");
var path = require("path");
var express = require('express');
var app = express();

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("It's a server on index.js!");
  response.end();
}).listen(3000);

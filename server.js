var http = require("http");
var fs = require("fs");
var path = require("path");
var express = require('express');

var app = express();

app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res){
  res.type('text/plain');
  res.send('plain text outputs: /hmd ; /controller ; /cube');
});

app.get('/hmd', function(req, res){
  res.type('text/plain');
  res.send('here comes the VR data');
});

app.get('/controller', function(req, res){
  res.type('text/plain');
  res.send('here comes the Leap/Physical controller data');
});

app.get('/cube', function(req, res){
  res.type('text/plain');
  res.send('here comes the cube data');
});

app.use(function(req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not found');
});

app.listen(app.get('port'), function() {
  console.log('Express started on port' + app.get('port'))
});

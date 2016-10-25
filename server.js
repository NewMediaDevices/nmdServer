// opt indien we gebruikmaken van express
var http = require("http");
var fs = require("fs");
var path = require("path");
//
var express = require('express');
var bodyParser = require('body-parser');
//USE DUMMY data
var mongoose   = require('mongoose');
mongoose.connect('mongodb://nmd_dummy:nmd_dummy@ds019123.mlab.com:19123/nmd'); // connect to our database

var app = express();

//DATA MODELS
var Session     = require('./models/session');

//CONFIG
app.set('port', process.env.PORT || 3000);
//use bodyparser to get POST data
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//ROUTER for API
var router = express.Router();

router.use(function(req, res, next){
  //add a check or a log
  next();
});

router.get('/', function(req,res) {
  res.json({ message: 'try an outpoint, /sessions for example'});
});

router.route('/sessions')
  .post(function(req, res){
      var session = new Session();
      session.id = req.body.id;
      session.state = req.body.state;
      session.description = req.body.description;
      //save it
      session.save(function(err){
        if (err) {
          res.send(err);
        } else {
          res.json({ message: 'Created new'})
        }
      });
    })
    .get(function(req, res){
      Session.find(function(err, sessions) {
        if (err) {
          res.send(err);
        } else {
          res.json(sessions);
        }
      });
    });

app.use('/api', router);

app.listen(app.get('port'), function() {
  console.log('Express started on port' + app.get('port'))
});



//AFGESCHREVEN
/*
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
*/

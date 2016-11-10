// opt indien we gebruikmaken van express
var http = require("http");
var fs = require("fs");
var path = require("path");
//
var express = require('express');
var bodyParser = require('body-parser');
var socket = require('socket.io');
//USE DUMMY data
var mongoose   = require('mongoose');
mongoose.connect('mongodb://nmd_dummy:nmd_dummy@ds019123.mlab.com:19123/nmd'); // connect to our database

var app = express();

//DATA MODELS
var Session = require('./models/session');

//CONFIG
app.set('port', process.env.PORT || 3000);
//use bodyparser to get POST data
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//use static
app.use(express.static('api'));

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

router.route('/sessions/:sessions_id')
  .get(function(req, res){
    Session.findById(req.params.sessions_id, function(err, session){
      if(err) {
        res.send(err);
      } else {
        res.json(session);
      };
    })
  });

/*IMPLEMENTATION FROM AI experiment Session 5*/
var sentences = [];

router.route('/getSentence')
    .get(function(req, res){
      if (sentences.length != 0) {
        var i = sentences.shift();
        res.json({ success : true, sentence : i });
      } else {
        res.json ({ success : false, sentence : 'No more sentences'});
      }
      /*
      Session.find(function(err, sessions) {
        if (err) {
          res.send(err);
        } else {
          res.json(sessions);
        }
      });
      */
    });

router.route('/pushSentence')
      .post(function(req, res){
          var sentence = req.body.sentence;
          if (sentences > 100) {
            res.json({ success : false, sentencesLength : sentences.length, newSentence : 'No sentence added, array is full'});
          } else {
            sentences.push(sentence);
            res.json({ success : true , sentencesLength : sentences.length, newSentence : sentence });

          }
          /*save it
          session.save(function(err){
            if (err) {
              res.send(err);
            } else {
              res.json({ message: 'Created new'})
            }
          });
          */
        });


app.use('/api', router);

var server = app.listen(app.get('port'), function() {
  console.log('Express started on port' + app.get('port'))
});

// SOCKET FUNCTIONS
var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log('new conn');
  console.log(socket);
  socket.emit('connectionStatus', true);
};


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

// opt indien we gebruikmaken van express
var http = require("http");
var fs = require("fs");
var path = require("path");
//
var express = require('express');
var bodyParser = require('body-parser');
var socket = require('socket.io');
var trumpygrimm = require('trumpygrimm');
//USE DUMMY data
var mongoose   = require('mongoose');
mongoose.connect('mongodb://nmd_dummy:nmd_dummy@ds019123.mlab.com:19123/nmd'); // connect to our database

var app = express();

//DATA MODELS
var Session = require('./models/session');
var Call = require('./models/call');

//SET UP MARKOV
trumpygrimm.createClient();
trumpygrimm.createMarkov();

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

//get or remove calls
router.route('/calls')
  .post(function(req, res){
      var call = new Call();
      call.description = req.body.description;
      call.team = req.body.team;
      //save it
      call.save(function(err){
        if (err) {
          res.send(err);
        } else {
          res.json({ message: 'Created new'})
        }
      });
    })
    .get(function(req, res){
      Call.find(function(err, calls) {
        if (err) {
          res.send(err);
        } else {
          res.json(calls);
        }
      });
    });

//session (outdated)
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
var currentSentence;

router.route('/getSentence')
    .get(function(req, res){
      trumpygrimm.getNewSentence(function(err, result) {
        if (err) {
          currentSentence = err;
          res.json({success : false, status : err});
        } else {
          sentences.push(result);
          res.json({success : true, result});
        }
      });
      /*
      if (sentences.length != 0) {
        var i = sentences.shift();
        res.json({ success : true, sentence : i });
      } else {
        res.json ({ success : false, sentence : 'No more sentences'});
      }
      Session.find(function(err, sessions) {
        if (err) {
          res.send(err);
        } else {
          res.json(sessions);
        }
      });
      */
    });

router.route('/getSentenceString')
        .get(function(req, res){
          trumpygrimm.getNewSentence(function(err, result) {
            if (err) {
              currentSentence = err;
              res.send(err.string);
            } else {
              sentences.push(result);
              res.send(result.string);
            }
          });
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
        });

app.use('/api', router);

var server = app.listen(app.get('port'), function() {
  console.log('Express started on port' + app.get('port'))
});

// SOCKET FUNCTIONS
//setup
var io = socket(server);
io.sockets.on('connection', newConnection);

//all websocket functions
function newConnection(socket) {
  console.log('new conn');
  console.log(socket);
  socket.emit('connectionStatus', true);

  //answer with all the available api calls
  Call.find(function(err, calls) {
    if (err) {
      socket.emit('error', 'No calls available, check your host')
    } else {
      socket.emit('getAllCalls', calls);
    }
  });
  //request a newSentence through websockets
  socket.on('getNewSentence', function() {
    console.log('new sentence requested');
    trumpygrimm.getNewSentence(function(result) {
      if (result) {
        currentSentence = result;
        io.emit('newSentence', currentSentence );
      }
    })
  });

  //add a call through sockets
  socket.on('addCall', function(data){
    var call = new Call();
    call.description = data.description;
    call.team = data.team;
    //save it
    call.save(function(err){
      if (err) {
        socket.emit('error', 'Could not create new call')
      } else {
        Call.find(function(err, calls) {
          if (err) {
            socket.emit('error', 'No calls available, check your host')
          } else {
            socket.emit('getAllCalls', calls);
          }
        });
      }
    });
  })

  //request a newSentence through websockets
  socket.on('getAllCals', function() {
    console.log('all calls requested');
  });

  //on "getCurrentSentence"
  //respond to this socket only
  //with currentSentence-OBJECT
  // without creating a new one through websockets
  socket.on('getCurrentSentence', function() {
    if(currentSentence) {
      console.log('current sentence requested');
      socket.emit('newSentence', currentSentence);
    } else {
      //when there is no currentSentence (this is the first request)
      //create one anyway
      //push it to ALL connected sockets
      console.log('create new anyway');
      //TODO: make decent getNewSentence function
      trumpygrimm.getNewSentence(function(result) {
        if (result) {
          currentSentence = result;
          io.emit('newSentence', currentSentence );
        }
      });
    };
  });


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

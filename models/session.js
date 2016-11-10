//model for dummy data
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SessionSchema = new Schema({
  id: Number,
  state: Number,
  description: String,
  hand : [{
    x : Number,
    y : Number,
    z : Number
  }]
});

module.exports = mongoose.model('Session', SessionSchema);


/*
trk : [{
    lat : String,
    lng : String
     }]
    */

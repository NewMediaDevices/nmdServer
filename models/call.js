//model for dummy data
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CallSchema = new Schema({
  id: Number,
  description: String,
  team: String
});

module.exports = mongoose.model('Call', CallSchema);


/*
trk : [{
    lat : String,
    lng : String
     }]
    */

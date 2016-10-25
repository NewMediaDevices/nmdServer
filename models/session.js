//model for dummy data
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SessionSchema = new Schema({
  id: Number,
  state: Number,
  description: String
});

module.exports = mongoose.model('Session', SessionSchema);

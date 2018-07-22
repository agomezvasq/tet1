var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: { 
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    },
    required: true
  },
  time: {
    type: Date,
    required: true
  }
});

var Event = mongoose.model('Event', EventSchema);
module.exports = Event;
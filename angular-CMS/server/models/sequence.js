var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sequenceSchema = new Schema({
  maxDocumentId: { type: Number, required: true },
  maxMessageId: { type: Number, required: true },
  maxContactId: { type: Number, required: true }
});

module.exports = mongoose.model('Sequence', sequenceSchema);

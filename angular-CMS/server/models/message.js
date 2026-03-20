var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  id: { type: String, required: true },
  subject: { type: String, required: true },
  msgText: { type: String, required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'Contact' }
});

module.exports = mongoose.model('Message', messageSchema);

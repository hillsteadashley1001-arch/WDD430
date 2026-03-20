var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Nested child docs in Mongo match lesson JSON (id, name, url, optional children), not ObjectId refs.
var documentSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  url: { type: String },
  children: { type: [Schema.Types.Mixed], default: [] }
});

module.exports = mongoose.model('Document', documentSchema);

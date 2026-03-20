var Sequence = require('../models/sequence');

var maxDocumentId;
var maxMessageId;
var maxContactId;
var sequenceId = null;

function SequenceGenerator() {
  Sequence.findOne()
    .exec()
    .then(function (sequence) {
      if (!sequence) {
        console.error(
          'SequenceGenerator: no document found in sequences collection.'
        );
        return;
      }

      sequenceId = sequence._id;
      maxDocumentId = sequence.maxDocumentId;
      maxMessageId = sequence.maxMessageId;
      maxContactId = sequence.maxContactId;
    })
    .catch(function (err) {
      console.error('SequenceGenerator init error:', err);
    });
}

SequenceGenerator.prototype.nextId = function (collectionType) {
  if (!sequenceId) {
    console.error('SequenceGenerator.nextId: sequence not loaded yet.');
    return -1;
  }

  var updateObject = {};
  var nextId;

  switch (collectionType) {
    case 'documents':
      maxDocumentId++;
      updateObject = { maxDocumentId: maxDocumentId };
      nextId = maxDocumentId;
      break;
    case 'messages':
      maxMessageId++;
      updateObject = { maxMessageId: maxMessageId };
      nextId = maxMessageId;
      break;
    case 'contacts':
      maxContactId++;
      updateObject = { maxContactId: maxContactId };
      nextId = maxContactId;
      break;
    default:
      return -1;
  }

  Sequence.updateOne({ _id: sequenceId }, { $set: updateObject }).exec().catch(
    function (err) {
      console.log('nextId error = ' + err);
    }
  );

  return nextId;
};

module.exports = new SequenceGenerator();

var express = require('express');
var router = express.Router();
const Document = require('../models/document');
const sequenceGenerator = require('./sequenceGenerator');

function stripMongoId(doc) {
  if (!doc) return doc;
  var o = doc.toObject ? doc.toObject() : doc;
  delete o._id;
  delete o.__v;
  return o;
}

// GET all documents — GET /documents
router.get('/', (req, res, next) => {
  Document.find()
    .sort({ name: 1 })
    .exec()
    .then((documents) => {
      return res.status(200).json(documents.map(stripMongoId));
    })
    .catch((err) => {
      return res.status(500).json({
        message: 'An error occurred',
        error: err
      });
    });
});

// GET one document by natural id
router.get('/:id', function (req, res) {
  Document.findOne({ id: req.params.id })
    .then(function (document) {
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }
      res.status(200).json(stripMongoId(document));
    })
    .catch(function (err) {
      res.status(500).json({ message: 'An error occurred', error: err });
    });
});

// POST create document — POST /documents
router.post('/', (req, res, next) => {
  const maxDocumentId = sequenceGenerator.nextId('documents');

  if (maxDocumentId < 0) {
    return res.status(503).json({
      message: 'Sequence not ready; try again in a moment.'
    });
  }

  const document = new Document({
    id: maxDocumentId,
    name: req.body.name,
    description: req.body.description,
    url: req.body.url
  });

  document
    .save()
    .then((createdDocument) => {
      return res.status(201).json({
        message: 'Document added successfully',
        document: stripMongoId(createdDocument)
      });
    })
    .catch((error) => {
      return res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// PUT update document by natural id — PUT /documents/:id
router.put('/:id', (req, res, next) => {
  Document.findOne({ id: req.params.id })
    .then((document) => {
      if (!document) {
        return res.status(404).json({
          message: 'Document not found.',
          error: { document: 'Document not found' }
        });
      }

      document.name = req.body.name;
      document.description = req.body.description;
      document.url = req.body.url;

      // updateOne expects a plain update object (not a full Document instance)
      return Document.updateOne(
        { id: req.params.id },
        {
          name: document.name,
          description: document.description,
          url: document.url
        }
      ).then(() => {
        return res.status(204).json({
          message: 'Document updated successfully'
        });
      });
    })
    .catch((error) => {
      return res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// DELETE document by natural id — DELETE /documents/:id
router.delete('/:id', (req, res, next) => {
  Document.findOne({ id: req.params.id })
    .then((document) => {
      if (!document) {
        return res.status(500).json({
          message: 'Document not found.',
          error: { document: 'Document not found' }
        });
      }

      return Document.deleteOne({ id: req.params.id })
        .then(() => {
          return res.status(204).json({
            message: 'Document deleted successfully'
          });
        })
        .catch((error) => {
          return res.status(500).json({
            message: 'An error occurred',
            error: error
          });
        });
    })
    .catch((error) => {
      return res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const Message = require('../models/message');
const Contact = require('../models/contact');
const sequenceGenerator = require('./sequenceGenerator');

/** Resolve sender: Mongo ObjectId string, or natural contact id (e.g. "7"). */
async function resolveSender(sender) {
  if (sender === undefined || sender === null || sender === '') {
    return null;
  }
  if (sender instanceof mongoose.Types.ObjectId) {
    return sender;
  }
  var s = String(sender);
  if (
    mongoose.Types.ObjectId.isValid(s) &&
    new mongoose.Types.ObjectId(s).toString() === s
  ) {
    return new mongoose.Types.ObjectId(s);
  }
  var contact = await Contact.findOne({ id: s });
  return contact ? contact._id : null;
}

function stripMongoId(doc) {
  if (!doc) return doc;
  var o = doc.toObject ? doc.toObject() : doc;
  delete o._id;
  delete o.__v;
  return o;
}

// GET all messages — GET /messages
router.get('/', (req, res, next) => {
  Message.find()
    .sort({ id: 1 })
    .exec()
    .then((messages) => {
      return res.status(200).json(messages.map(stripMongoId));
    })
    .catch((err) => {
      return res.status(500).json({
        message: 'An error occurred',
        error: err
      });
    });
});

// GET one message by natural id
router.get('/:id', function (req, res) {
  Message.findOne({ id: req.params.id })
    .then(function (message) {
      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }
      res.status(200).json(stripMongoId(message));
    })
    .catch(function (err) {
      res.status(500).json({ message: 'An error occurred', error: err });
    });
});

// POST create message — POST /messages
router.post('/', (req, res, next) => {
  const maxMessageId = sequenceGenerator.nextId('messages');

  if (maxMessageId < 0) {
    return res.status(503).json({
      message: 'Sequence not ready; try again in a moment.'
    });
  }

  resolveSender(req.body.sender)
    .then((sender) => {
      const message = new Message({
        id: maxMessageId,
        subject: req.body.subject,
        msgText: req.body.msgText,
        sender: sender
      });
      return message.save();
    })
    .then((createdMessage) => {
      return res.status(201).json({
        message: 'Message added successfully',
        createdMessage: stripMongoId(createdMessage)
      });
    })
    .catch((error) => {
      return res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// PUT update message by natural id — PUT /messages/:id
router.put('/:id', (req, res, next) => {
  Message.findOne({ id: req.params.id })
    .then((message) => {
      if (!message) {
        return res.status(404).json({
          message: 'Message not found.',
          error: { message: 'Message not found' }
        });
      }

      return resolveSender(req.body.sender).then((sender) => {
        message.subject = req.body.subject;
        message.msgText = req.body.msgText;
        message.sender = sender;

        return Message.updateOne(
          { id: req.params.id },
          {
            subject: message.subject,
            msgText: message.msgText,
            sender: message.sender
          }
        ).then(() => {
          return res.status(204).json({
            message: 'Message updated successfully'
          });
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

// DELETE message by natural id — DELETE /messages/:id
router.delete('/:id', (req, res, next) => {
  Message.findOne({ id: req.params.id })
    .then((message) => {
      if (!message) {
        return res.status(500).json({
          message: 'Message not found.',
          error: { message: 'Message not found' }
        });
      }

      return Message.deleteOne({ id: req.params.id })
        .then(() => {
          return res.status(204).json({
            message: 'Message deleted successfully'
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

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const Contact = require('../models/contact');
const sequenceGenerator = require('./sequenceGenerator');

/**
 * Map one group entry to a Contact _id: accepts ObjectId, 24-char hex string,
 * or natural contact id (e.g. "7") via lookup.
 */
function resolveGroupMemberToObjectId(g) {
  if (g == null) {
    return Promise.resolve(null);
  }
  if (g instanceof mongoose.Types.ObjectId) {
    return Promise.resolve(g);
  }
  var s = String(g);
  if (
    mongoose.Types.ObjectId.isValid(s) &&
    new mongoose.Types.ObjectId(s).toString() === s
  ) {
    return Promise.resolve(new mongoose.Types.ObjectId(s));
  }
  return Contact.findOne({ id: s }).then(function (contact) {
    return contact ? contact._id : null;
  });
}

/**
 * Map the group array from the request body to an array of Contact ObjectIds.
 * undefined → undefined (caller decides default). null → null.
 */
function mapGroupReferences(group) {
  if (group === undefined) {
    return Promise.resolve(undefined);
  }
  if (group === null) {
    return Promise.resolve(null);
  }
  if (!Array.isArray(group)) {
    return Promise.resolve(group);
  }
  return Promise.all(group.map(resolveGroupMemberToObjectId)).then(function (ids) {
    return ids.filter(function (id) {
      return id != null;
    });
  });
}

function stripMongoId(doc) {
  if (!doc) return doc;
  var o = doc.toObject ? doc.toObject() : doc;
  delete o._id;
  delete o.__v;
  return o;
}

/** Strip _id from contact and from populated group members (Angular expects Contact[]). */
function stripContactForResponse(contact) {
  var o = stripMongoId(contact);
  if (o && Array.isArray(o.group)) {
    o.group = o.group
      .map(function (member) {
        if (
          member &&
          typeof member === 'object' &&
          Object.prototype.hasOwnProperty.call(member, '_id')
        ) {
          return stripMongoId(member);
        }
        return member;
      })
      .filter(function (m) {
        return m != null;
      });
  }
  return o;
}

// GET all contacts — GET /contacts
router.get('/', (req, res, next) => {
  Contact.find()
    .populate('group')
    .sort({ name: 1 })
    .then((contacts) => {
      return res.status(200).json({
        message: 'Contacts fetched successfully!',
        contacts: contacts.map(stripContactForResponse)
      });
    })
    .catch((error) => {
      return res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// GET one contact by natural id
router.get('/:id', function (req, res) {
  Contact.findOne({ id: req.params.id })
    .populate('group')
    .then(function (contact) {
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.status(200).json(stripContactForResponse(contact));
    })
    .catch(function (err) {
      res.status(500).json({ message: 'An error occurred', error: err });
    });
});

// POST create contact — POST /contacts
router.post('/', (req, res, next) => {
  const maxContactId = sequenceGenerator.nextId('contacts');

  if (maxContactId < 0) {
    return res.status(503).json({
      message: 'Sequence not ready; try again in a moment.'
    });
  }

  var groupPromise = Object.prototype.hasOwnProperty.call(req.body, 'group')
    ? mapGroupReferences(req.body.group)
    : Promise.resolve([]);

  groupPromise
    .then((groupVal) => {
      const contact = new Contact({
        id: maxContactId,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        imageUrl: req.body.imageUrl,
        group: groupVal
      });
      return contact.save();
    })
    .then((createdContact) => {
      return Contact.findById(createdContact._id)
        .populate('group')
        .then((populated) => {
          return res.status(201).json({
            message: 'Contact added successfully',
            contact: stripContactForResponse(populated)
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

// PUT update contact by natural id — PUT /contacts/:id
router.put('/:id', (req, res, next) => {
  Contact.findOne({ id: req.params.id })
    .then((contact) => {
      if (!contact) {
        return res.status(404).json({
          message: 'Contact not found.',
          error: { contact: 'Contact not found' }
        });
      }

      var groupPromise = Object.prototype.hasOwnProperty.call(req.body, 'group')
        ? mapGroupReferences(req.body.group)
        : Promise.resolve(null);

      return groupPromise.then((mappedGroup) => {
        contact.name = req.body.name;
        contact.email = req.body.email;
        contact.phone = req.body.phone;
        contact.imageUrl = req.body.imageUrl;
        if (mappedGroup !== null) {
          contact.group = mappedGroup;
        }

        return Contact.updateOne(
          { id: req.params.id },
          {
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            imageUrl: contact.imageUrl,
            group: contact.group
          }
        ).then(() => {
          return res.status(204).json({
            message: 'Contact updated successfully'
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

// DELETE contact by natural id — DELETE /contacts/:id
router.delete('/:id', (req, res, next) => {
  Contact.findOne({ id: req.params.id })
    .then((contact) => {
      if (!contact) {
        return res.status(500).json({
          message: 'Contact not found.',
          error: { contact: 'Contact not found' }
        });
      }

      return Contact.deleteOne({ id: req.params.id })
        .then(() => {
          return res.status(204).json({
            message: 'Contact deleted successfully'
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

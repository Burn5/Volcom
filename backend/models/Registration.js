const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userRole: {
      type: String,
      enum: ['Volunteer', 'Organization'],
      required: true
    },
    opportunityKey: {
      type: Number,
      required: true
    },
    title: String,
    organization: String,
    date: String,
    location: String,
    status: {
      type: String,
      enum: ['Registered', 'Cancelled'],
      default: 'Registered'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Registration', registrationSchema);

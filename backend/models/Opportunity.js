const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    organization: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true }, // or Date if you prefer
    skillsRequired: { type: String },
    slots: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ['Open', 'Closed'],
      default: 'Open'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Opportunity', opportunitySchema);

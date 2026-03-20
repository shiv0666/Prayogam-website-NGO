const mongoose = require('mongoose');

const storySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    fullStory: {
      type: String,
      trim: true,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    },
    defaultKey: {
      type: String,
      trim: true,
      default: null,
      unique: true,
      sparse: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Story', storySchema);

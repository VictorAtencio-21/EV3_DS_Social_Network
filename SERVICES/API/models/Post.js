
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    post: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: [{
        type: Array,
        default: [],
        timestamps: true
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
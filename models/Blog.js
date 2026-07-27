const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    coverImage: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
    


module.exports = mongoose.model("Blog",blogSchema);

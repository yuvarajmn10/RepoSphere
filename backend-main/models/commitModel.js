const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommitSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    filesChanged: [
      {
        type: String,
      },
    ],
    repository: {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Commit = mongoose.model("Commit", CommitSchema);
module.exports = Commit;

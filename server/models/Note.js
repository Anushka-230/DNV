const mongoose = require("mongoose");
const { Schema } = mongoose;

const noteSchema = new Schema(
  {
    classSubjectId: {
      type: Schema.Types.ObjectId,
      ref: "ClassSubject",
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    title: {
      type: String,
      required: true, // "Chapter 3 - Trigonometry Notes"
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true, // URL of uploaded file (Cloudinary, etc.)
    },
    fileType: {
      type: String,
      enum: ["pdf", "image", "doc"],
      default: "pdf",
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
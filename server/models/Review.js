import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    laptop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Laptop",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

// One review per user per laptop
reviewSchema.index({ user: 1, laptop: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;

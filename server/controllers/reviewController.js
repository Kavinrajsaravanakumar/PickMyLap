import Review from "../models/Review.js";
import Laptop from "../models/Laptop.js";

// POST /api/reviews — protected
export const addReview = async (req, res, next) => {
  try {
    const { laptopId, rating, comment } = req.body;

    const laptop = await Laptop.findOne({ laptopId });
    if (!laptop) return res.status(404).json({ message: "Laptop not found" });

    // Check duplicate
    const existing = await Review.findOne({
      user: req.user._id,
      laptop: laptop._id,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You already reviewed this laptop" });
    }

    const review = await Review.create({
      user: req.user._id,
      laptop: laptop._id,
      rating: Number(rating),
      comment,
    });

    // Update laptop average rating
    const allReviews = await Review.find({ laptop: laptop._id });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    laptop.rating = Math.round(avgRating * 10) / 10;
    laptop.reviewCount = allReviews.length;
    await laptop.save();

    const populated = await review.populate("user", "name");
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

// GET /api/reviews/:laptopId
export const getReviewsByLaptop = async (req, res, next) => {
  try {
    const laptop = await Laptop.findOne({ laptopId: req.params.laptopId });
    if (!laptop) return res.status(404).json({ message: "Laptop not found" });

    const reviews = await Review.find({ laptop: laptop._id })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

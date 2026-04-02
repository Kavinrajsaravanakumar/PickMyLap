import Laptop from "../models/Laptop.js";

// GET /api/laptops  — filter, search, sort, paginate
export const getLaptops = async (req, res, next) => {
  try {
    const {
      brand,
      minPrice,
      maxPrice,
      minRam,
      storage,
      processorBrand,
      gpuType,
      minRating,
      search,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (brand) filter.brand = { $in: brand.split(",") };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minRam) filter["ram.sizeGB"] = { $gte: Number(minRam) };
    if (storage) filter["storage.0.sizeGB"] = { $gte: Number(storage) };
    if (processorBrand) filter["processor.brand"] = { $in: processorBrand.split(",") };
    if (gpuType) filter["graphics.type"] = gpuType;
    if (minRating) filter.rating = { $gte: Number(minRating) };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { series: { $regex: search, $options: "i" } },
        { "processor.model": { $regex: search, $options: "i" } },
      ];
    }

    // Sorting
    let sortObj = { createdAt: -1 };
    if (sort === "price_asc") sortObj = { price: 1 };
    else if (sort === "price_desc") sortObj = { price: -1 };
    else if (sort === "rating") sortObj = { rating: -1 };
    else if (sort === "name") sortObj = { name: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [laptops, total] = await Promise.all([
      Laptop.find(filter).sort(sortObj).skip(skip).limit(Number(limit)),
      Laptop.countDocuments(filter),
    ]);

    res.json({
      laptops,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/laptops/:id
export const getLaptopById = async (req, res, next) => {
  try {
    const laptop = await Laptop.findOne({ laptopId: req.params.id });
    if (!laptop) return res.status(404).json({ message: "Laptop not found" });
    res.json(laptop);
  } catch (err) {
    next(err);
  }
};

// GET /api/laptops/:id/recommendations — content-based
export const getRecommendations = async (req, res, next) => {
  try {
    const source = await Laptop.findOne({ laptopId: req.params.id });
    if (!source) return res.status(404).json({ message: "Laptop not found" });

    const priceRange = 0.35;
    const minP = source.price * (1 - priceRange);
    const maxP = source.price * (1 + priceRange);

    const recommendations = await Laptop.find({
      laptopId: { $ne: source.laptopId },
      price: { $gte: minP, $lte: maxP },
    }).limit(6);

    // Score and sort by similarity
    const scored = recommendations.map((lap) => {
      let score = 0;
      // Same GPU type
      if (lap.graphics.type === source.graphics.type) score += 3;
      // Close RAM
      if (Math.abs(lap.ram.sizeGB - source.ram.sizeGB) <= 8) score += 2;
      // Same processor brand
      if (lap.processor.brand === source.processor.brand) score += 2;
      // Similar display size
      if (Math.abs(lap.display.sizeInches - source.display.sizeInches) <= 1.5)
        score += 1;
      // Similar weight
      if (Math.abs(lap.weightKg - source.weightKg) <= 0.5) score += 1;

      return { laptop: lap, score };
    });

    scored.sort((a, b) => b.score - a.score);
    res.json(scored.slice(0, 4).map((s) => s.laptop));
  } catch (err) {
    next(err);
  }
};

// GET /api/laptops/seed — seed DB with initial data
export const seedLaptops = async (_req, res, next) => {
  try {
    const { laptopsData } = await import("../seed.js");
    await Laptop.deleteMany({});
    await Laptop.insertMany(laptopsData);
    res.json({ message: `Seeded ${laptopsData.length} laptops` });
  } catch (err) {
    next(err);
  }
};

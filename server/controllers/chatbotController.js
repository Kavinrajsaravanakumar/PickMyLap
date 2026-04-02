import Laptop from "../models/Laptop.js";

// POST /api/chatbot
export const processQuery = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "Message required" });

    const msg = message.toLowerCase();
    const filter = {};
    const explanations = [];

    // --- Extract budget ---
    const budgetMatch = msg.match(
      /(?:under|below|budget|within|less than|max|upto|up to)\s*(?:₹|rs\.?|inr)?\s*(\d[\d,]*)/i
    );
    if (budgetMatch) {
      const budget = Number(budgetMatch[1].replace(/,/g, ""));
      filter.price = { $lte: budget };
      explanations.push(`Budget ≤ ₹${budget.toLocaleString()}`);
    }

    const minBudgetMatch = msg.match(
      /(?:above|over|more than|min|minimum|starting)\s*(?:₹|rs\.?|inr)?\s*(\d[\d,]*)/i
    );
    if (minBudgetMatch) {
      const minB = Number(minBudgetMatch[1].replace(/,/g, ""));
      filter.price = { ...filter.price, $gte: minB };
      explanations.push(`Min price ₹${minB.toLocaleString()}`);
    }

    // --- Extract brand ---
    const brands = [
      "hp", "dell", "lenovo", "asus", "acer", "apple", "msi",
      "samsung", "aerion", "nextron", "edutech", "forge",
    ];
    const mentionedBrands = brands.filter((b) => msg.includes(b));
    if (mentionedBrands.length) {
      filter.brand = {
        $in: mentionedBrands.map((b) => new RegExp(`^${b}$`, "i")),
      };
      explanations.push(`Brand: ${mentionedBrands.join(", ")}`);
    }

    // --- Use-case keywords ---
    const gamingKeywords = ["gaming", "game", "gamer", "fps", "esports"];
    const codingKeywords = ["coding", "programming", "developer", "development", "software"];
    const studentKeywords = ["student", "study", "college", "school", "education"];
    const creatorKeywords = ["creator", "editing", "video editing", "content", "design", "creative"];
    const lightKeywords = ["light", "lightweight", "portable", "travel", "thin"];

    if (gamingKeywords.some((k) => msg.includes(k))) {
      filter["graphics.type"] = "dedicated";
      if (!filter.price) filter.price = {};
      explanations.push("Gaming: dedicated GPU, high refresh display");
    }

    if (codingKeywords.some((k) => msg.includes(k))) {
      filter["ram.sizeGB"] = { $gte: 16 };
      explanations.push("Coding: ≥16GB RAM recommended");
    }

    if (studentKeywords.some((k) => msg.includes(k))) {
      if (!filter.price) filter.price = { $lte: 70000 };
      filter.weightKg = { $lte: 1.8 };
      explanations.push("Student: budget-friendly & lightweight");
    }

    if (creatorKeywords.some((k) => msg.includes(k))) {
      filter["ram.sizeGB"] = { $gte: 16 };
      filter["graphics.type"] = "dedicated";
      explanations.push("Creator: ≥16GB RAM, dedicated GPU");
    }

    if (lightKeywords.some((k) => msg.includes(k))) {
      filter.weightKg = { $lte: 1.5 };
      explanations.push("Lightweight: ≤1.5 kg");
    }

    // --- RAM keyword ---
    const ramMatch = msg.match(/(\d+)\s*gb\s*ram/i);
    if (ramMatch) {
      filter["ram.sizeGB"] = { $gte: Number(ramMatch[1]) };
      explanations.push(`RAM ≥ ${ramMatch[1]}GB`);
    }

    // --- Query DB ---
    let laptops = await Laptop.find(filter)
      .sort({ rating: -1 })
      .limit(4);

    // Fallback: if no results, broaden
    if (!laptops.length) {
      laptops = await Laptop.find({})
        .sort({ rating: -1 })
        .limit(3);
      explanations.push(
        "No exact matches found — showing top-rated laptops instead"
      );
    }

    const response = explanations.length
      ? `Based on your needs (${explanations.join("; ")}), here are my top recommendations:`
      : "Here are some laptops you might like:";

    res.json({
      reply: response,
      laptops: laptops.map((l) => ({
        laptopId: l.laptopId,
        name: l.name,
        brand: l.brand,
        price: l.price,
        rating: l.rating,
        processor: `${l.processor.brand} ${l.processor.model}`,
        ram: `${l.ram.sizeGB}GB ${l.ram.type}`,
        graphics: l.graphics.model,
        display: `${l.display.sizeInches}" ${l.display.panel}`,
        weightKg: l.weightKg,
      })),
    });
  } catch (err) {
    next(err);
  }
};

import mongoose from "mongoose";

const processorSchema = new mongoose.Schema(
  {
    brand: String,
    model: String,
    cores: Number,
    threads: Number,
    baseClock: String,
    boostClock: String,
  },
  { _id: false }
);

const ramSchema = new mongoose.Schema(
  {
    sizeGB: Number,
    type: String,
    speedMHz: Number,
    upgradableToGB: Number,
  },
  { _id: false }
);

const storageSchema = new mongoose.Schema(
  {
    type: String,
    sizeGB: Number,
  },
  { _id: false }
);

const graphicsSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["integrated", "dedicated"] },
    model: String,
    vramGB: Number,
  },
  { _id: false }
);

const displaySchema = new mongoose.Schema(
  {
    sizeInches: Number,
    resolution: String,
    refreshHz: Number,
    panel: String,
    aspect: String,
  },
  { _id: false }
);

const batterySchema = new mongoose.Schema(
  {
    capacityWh: Number,
    claimedHours: String,
    fastCharge: Boolean,
  },
  { _id: false }
);

const connectivitySchema = new mongoose.Schema(
  {
    wifi: String,
    bluetooth: String,
  },
  { _id: false }
);

const laptopSchema = new mongoose.Schema(
  {
    laptopId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    series: String,
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    processor: processorSchema,
    ram: ramSchema,
    storage: [storageSchema],
    graphics: graphicsSchema,
    display: displaySchema,
    battery: batterySchema,
    weightKg: Number,
    os: String,
    ports: [String],
    connectivity: connectivitySchema,
    warrantyYears: Number,
    image: String,
  },
  { timestamps: true }
);

// Text index for search
laptopSchema.index({ name: "text", brand: "text", series: "text" });

const Laptop = mongoose.model("Laptop", laptopSchema);
export default Laptop;

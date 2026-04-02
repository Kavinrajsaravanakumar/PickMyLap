import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchLaptopById, fetchRecommendations, getReviews, addReview } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useCompare } from "../context/CompareContext";
import Footer from "./Footer";

const INdproduct = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCompare, compareList } = useCompare();

  const [laptop, setLaptop] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewMsg, setReviewMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data: lap } = await fetchLaptopById(id);
        setLaptop(lap);
        const [recsRes, revRes] = await Promise.all([
          fetchRecommendations(id).catch(() => ({ data: [] })),
          getReviews(id).catch(() => ({ data: [] })),
        ]);
        setRecommendations(recsRes.data);
        setReviews(revRes.data);
      } catch {
        setLaptop(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewMsg("");
    try {
      const { data } = await addReview({
        laptopId: laptop.laptopId,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setReviews((prev) => [data, ...prev]);
      setReviewForm({ rating: 5, comment: "" });
      setReviewMsg("Review added!");
    } catch (err) {
      setReviewMsg(err.response?.data?.message || "Failed to add review");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (!laptop) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Product not found.
      </div>
    );
  }

  const isInCompare = compareList.some(
    (l) => (l.laptopId || l._id) === laptop.laptopId
  );

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      <div className="flex flex-grow w-full bg-white py-10 px-16">
        {/* Left Section */}
        <div className="flex flex-col gap-10">
          <div className="flex">
            <div className="flex flex-col items-center gap-3 w-[90px] mr-5">
              {Array(6)
                .fill(laptop.image)
                .map((src, i) => (
                  <div
                    key={i}
                    className="w-[70px] h-[70px] flex items-center justify-center overflow-hidden rounded-md border border-gray-300 cursor-pointer hover:border-blue-500 transition"
                  >
                    <img src={src} alt="Thumbnail" className="w-full h-13 object-cover" />
                  </div>
                ))}
            </div>

            <div className="flex items-center justify-center w-[500px] h-[550px] border border-gray-300">
              <img
                src={laptop.image}
                alt={laptop.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          {/* Price Check */}
          <div className="primary flex flex-col gap-4 p-4 bg-gray-50 rounded-2xl shadow-md w-xl mx-auto">
            <div className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition gap-20">
              <div className="flex items-center gap-3">
                <img src="https://img.icons8.com/?size=100&id=UU2im0hihoyi&format=png&color=000000" alt="Flipkart" className="w-10 h-10" />
                <span className="text-gray-800 font-medium">Flipkart</span>
              </div>
              <span className="text-green-600 font-semibold">₹{Math.round(laptop.price * 1.01).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <img src="https://img.icons8.com/?size=100&id=67j6ReSm130J&format=png&color=000000" alt="Amazon" className="w-10 h-10" />
                <span className="text-gray-800 font-medium">Amazon</span>
              </div>
              <span className="text-green-600 font-semibold">₹{laptop.price.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <img src="https://upload.wikimedia.org/wikipedia/en/5/54/JioMart_logo.svg" alt="JioMart" className="w-9 h-9 object-contain" />
                <span className="text-gray-800 font-medium">JioMart</span>
              </div>
              <span className="text-green-600 font-semibold">₹{Math.round(laptop.price * 0.99).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex gap-10 items-center justify-center">
            <button
              onClick={() => addToCompare(laptop)}
              disabled={isInCompare}
              className={`mt-5 text-white h-12 w-56 px-4 rounded active:scale-95 transition cursor-pointer ${
                isInCompare ? "bg-gray-400" : "primary"
              }`}
            >
              {isInCompare ? "✓ In Compare" : "Compare Product"}
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 ml-10 text-gray-800">
          <h1 className="text-3xl font-bold">{laptop.name}</h1>
          <p className="text-gray-500 text-base mb-2">
            {laptop.series} Series | {laptop.os}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="primary text-white text-base px-3 py-1 rounded-md">
              {laptop.rating} ★
            </div>
            <p className="text-gray-500 text-sm">
              ({laptop.reviewCount || 0} Ratings & {reviews.length} Reviews)
            </p>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex gap-5">
              <h2 className="text-4xl font-semibold text-gray-800">
                ₹{laptop.price.toLocaleString()}
              </h2>
            </div>
            <p className="text-gray-500 text-base mt-1">
              <span className="line-through mr-2 text-gray-400">
                ₹{(laptop.price * 1.25).toLocaleString()}
              </span>
              <span className="text-green-600 font-semibold">20% off</span>
            </p>
          </div>

          {/* Highlights */}
          <div className="border-t border-b border-gray-200 py-3 mb-6">
            <h3 className="font-semibold mb-2 text-xl">Key Highlights</h3>
            <ul className="list-disc ml-5 text-base space-y-1">
              <li className="text-green-600">{laptop.processor.model} Processor</li>
              <li className="text-green-600">{laptop.display.panel} Display</li>
              <li>Ultra lightweight design — only {laptop.weightKg} kg</li>
              <li className="text-green-600">High-speed {laptop.ram.type} RAM</li>
              <li className="text-green-600">
                {laptop.connectivity.wifi} & Bluetooth {laptop.connectivity.bluetooth}
              </li>
            </ul>
          </div>

          {/* Detailed Specs */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-xl">Display</h3>
              <ul className="list-none text-base mt-2 space-y-1">
                <li>Size: {laptop.display.sizeInches}"</li>
                <li className="text-green-600">Panel: {laptop.display.panel}</li>
                <li>Resolution: {laptop.display.resolution}</li>
                <li>Aspect Ratio: {laptop.display.aspect}</li>
                <li>Refresh Rate: {laptop.display.refreshHz}Hz</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-xl">Processor</h3>
              <ul className="list-none text-base mt-2 space-y-1">
                <li>Brand: {laptop.processor.brand}</li>
                <li>Model: {laptop.processor.model}</li>
                <li>Cores: {laptop.processor.cores}</li>
                <li>Threads: {laptop.processor.threads}</li>
                <li>Base Clock: {laptop.processor.baseClock}</li>
                <li className="text-green-600">Boost Clock: {laptop.processor.boostClock}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-xl">Memory & Storage</h3>
              <ul className="list-none text-base mt-2 space-y-1">
                <li className="text-green-600">RAM: {laptop.ram.sizeGB}GB {laptop.ram.type}</li>
                <li>Speed: {laptop.ram.speedMHz}MHz</li>
                <li>Storage: {laptop.storage[0].sizeGB}GB {laptop.storage[0].type}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-xl">Graphics</h3>
              <ul className="list-none text-base mt-2 space-y-1">
                <li>Type: {laptop.graphics.type}</li>
                <li className="text-green-600">Model: {laptop.graphics.model}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-xl">Battery</h3>
              <ul className="list-none text-base mt-2 space-y-1">
                <li>Capacity: {laptop.battery.capacityWh}Wh</li>
                <li>Backup: {laptop.battery.claimedHours}</li>
                {laptop.battery.fastCharge && <li className="text-green-600">⚡ Fast Charging Supported</li>}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-xl">Connectivity & Ports</h3>
              <ul className="list-none text-base mt-2 space-y-1">
                <li>Wi-Fi: {laptop.connectivity.wifi}</li>
                <li>Bluetooth: {laptop.connectivity.bluetooth}</li>
                {laptop.ports.map((port, i) => (
                  <li key={i}>{port}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-xl">Additional Info</h3>
              <ul className="list-none text-base mt-2 space-y-1">
                <li>OS: {laptop.os}</li>
                <li>Weight: {laptop.weightKg} kg</li>
                <li>Warranty: {laptop.warrantyYears} Year</li>
              </ul>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-10 border-t pt-6">
            <h3 className="font-semibold text-2xl mb-4">Reviews</h3>

            {/* Review form */}
            {user ? (
              <form onSubmit={handleReviewSubmit} className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4 mb-3">
                  <label className="text-sm font-medium">Rating:</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                    className="border rounded px-2 py-1"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} ★</option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Write your review..."
                  className="w-full border rounded-lg p-3 text-sm resize-none h-24 focus:border-violet-400 outline-none"
                />
                <button
                  type="submit"
                  className="mt-2 px-6 py-2 primary text-white rounded-lg text-sm font-medium hover:brightness-105 active:scale-95 transition cursor-pointer"
                >
                  Submit Review
                </button>
                {reviewMsg && <p className="mt-2 text-sm text-green-600">{reviewMsg}</p>}
              </form>
            ) : (
              <p className="text-gray-500 text-sm mb-4">Login to write a review.</p>
            )}

            {/* Reviews list */}
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r._id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="primary text-white text-xs px-2 py-0.5 rounded">
                        {r.rating} ★
                      </span>
                      <span className="text-sm font-medium">{r.user?.name || "User"}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {r.comment && <p className="text-sm text-gray-700">{r.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white px-16 py-10 border-t">
          <h3 className="text-2xl font-semibold mb-6">Similar Laptops You May Like</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.map((rec) => (
              <Link
                key={rec.laptopId}
                to={`/product/${rec.laptopId}`}
                className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition"
              >
                <h4 className="font-semibold text-sm">{rec.name}</h4>
                <p className="text-xs text-gray-500">{rec.brand} • {rec.series}</p>
                <p className="text-lg font-bold mt-2">₹{rec.price.toLocaleString()}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {rec.processor.brand} {rec.processor.model} • {rec.ram.sizeGB}GB • {rec.graphics.model}
                </p>
                <span className="primary text-white text-xs px-2 py-0.5 rounded mt-2 inline-block">
                  {rec.rating} ★
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default INdproduct;

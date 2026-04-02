import React from "react";
import { useCompare } from "../context/CompareContext";

const LongCard = ({
  laptopId,
  name,
  rating,
  price,
  image,
  processor,
  ram,
  storage,
  display,
  os,
  warrantyYears,
  mrp,
  laptop,
}) => {
  const { addToCompare, compareList } = useCompare();
  const isInCompare = compareList.some(
    (l) => (l.laptopId || l._id) === laptopId
  );

  return (
    <div className="p-2 w-full">
      <div
        className="relative flex flex-col md:flex-row bg-white border border-gray-300 rounded-lg shadow-sm p-5 
                   hover:shadow-md transition-all duration-200"
      >
        {/* Product Image */}
        <img
          src={
            image ||
            "https://m.media-amazon.com/images/I/8174YnTefkL._AC_UY327_FMwebp_QL65_.jpg"
          }
          alt={name}
          className="w-40 h-40 md:w-44 md:h-44 object-contain self-center md:self-start"
        />

        {/* Middle Content */}
        <div className="mt-4 md:mt-0 md:ml-6 flex flex-col justify-start flex-1">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer">
            {name}
          </h2>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-1">
            <span className="primary text-white text-xs font-semibold px-2 py-0.5 rounded">
              {rating} ★
            </span>
          </div>

          {/* Features */}
          <ul className="text-xs md:text-sm text-gray-700 font-medium mt-2 space-y-0.5">
            <li>
              Processor: {processor?.brand} {processor?.model}
            </li>
            <li>
              RAM: {ram?.sizeGB}GB {ram?.type}
            </li>
            <li>
              Storage: {storage?.[0]?.sizeGB}GB {storage?.[0]?.type}
            </li>
            <li>
              Display: {display?.sizeInches}" {display?.resolution}
            </li>
            <li>OS: {os}</li>
            <li>Warranty: {warrantyYears} Year Onsite</li>
          </ul>

          {/* Compare Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (laptop) addToCompare(laptop);
            }}
            disabled={isInCompare}
            className={`mt-3 text-xs px-4 py-1.5 rounded-full font-medium w-fit active:scale-95 transition ${
              isInCompare
                ? "bg-gray-200 text-gray-500 cursor-default"
                : "primary text-white cursor-pointer hover:brightness-105"
            }`}
          >
            {isInCompare ? "✓ Added" : "+ Compare"}
          </button>
        </div>

        {/* Price Section */}
        <div className="md:absolute md:top-5 md:right-6 mt-4 md:mt-0 text-right md:text-right flex md:block flex-col items-end">
          <p className="text-xl md:text-2xl font-bold text-gray-900">
            ₹{price.toLocaleString()}
          </p>

          {mrp && (
            <div className="flex items-center justify-end gap-2 text-xs md:text-sm mt-0.5">
              <p className="line-through text-gray-500">₹{mrp}</p>
              <p className="text-green-600 font-semibold">
                {Math.round(((mrp - price) / mrp) * 100)}% off
              </p>
            </div>
          )}

          <p className="text-green-700 text-xs md:text-sm mt-1 font-medium">
            Super Deals
          </p>
          <p className="text-green-700 text-xs md:text-sm font-medium">
            Bank Offer
          </p>
        </div>
      </div>
    </div>
  );
};

export default LongCard;

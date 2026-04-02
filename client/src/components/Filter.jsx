// Filter.jsx
import React, { useState } from "react";

const Filter = ({ filters, setFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilters(localFilters);
  };

  const clearFilters = () => {
    const cleared = {
      name: "",
      maxPrice: "",
      minPrice: "",
      minRating: "",
      brand: "",
      minRam: "",
      storage: "",
      processorBrand: "",
      gpuType: "",
      sort: "",
    };
    setLocalFilters(cleared);
    setFilters(cleared);
  };

  const selectClass =
    "w-60 h-9 px-2 border border-gray-400 rounded-lg text-sm bg-white focus:border-violet-400 outline-none";
  const inputClass =
    "w-60 h-9 px-2 border border-gray-400 rounded-lg text-sm focus:border-violet-400 outline-none";

  return (
    <div className="h-full w-80 flex flex-col gap-3 items-center border border-gray-400 rounded-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">Filters</h3>

      {/* Name / Search */}
      <input
        type="text"
        placeholder="Search by Name"
        className={inputClass}
        value={localFilters.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />

      {/* Brand */}
      <select
        className={selectClass}
        value={localFilters.brand}
        onChange={(e) => handleChange("brand", e.target.value)}
      >
        <option value="">All Brands</option>
        {["HP", "Dell", "Lenovo", "ASUS", "Acer", "Apple", "MSI", "Samsung", "Aerion", "Nextron", "EduTech", "Forge"].map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>

      {/* Price Range */}
      <input
        type="number"
        placeholder="Min Price"
        className={inputClass}
        value={localFilters.minPrice}
        onChange={(e) => handleChange("minPrice", e.target.value)}
      />
      <input
        type="number"
        placeholder="Max Price"
        className={inputClass}
        value={localFilters.maxPrice}
        onChange={(e) => handleChange("maxPrice", e.target.value)}
      />

      {/* RAM */}
      <select
        className={selectClass}
        value={localFilters.minRam}
        onChange={(e) => handleChange("minRam", e.target.value)}
      >
        <option value="">Any RAM</option>
        <option value="8">8 GB+</option>
        <option value="16">16 GB+</option>
        <option value="32">32 GB+</option>
      </select>

      {/* Storage */}
      <select
        className={selectClass}
        value={localFilters.storage}
        onChange={(e) => handleChange("storage", e.target.value)}
      >
        <option value="">Any Storage</option>
        <option value="256">256 GB+</option>
        <option value="512">512 GB+</option>
        <option value="1000">1 TB+</option>
      </select>

      {/* Processor Brand */}
      <select
        className={selectClass}
        value={localFilters.processorBrand}
        onChange={(e) => handleChange("processorBrand", e.target.value)}
      >
        <option value="">Any Processor</option>
        <option value="Intel">Intel</option>
        <option value="AMD">AMD</option>
        <option value="Apple">Apple</option>
      </select>

      {/* GPU Type */}
      <select
        className={selectClass}
        value={localFilters.gpuType}
        onChange={(e) => handleChange("gpuType", e.target.value)}
      >
        <option value="">Any GPU</option>
        <option value="integrated">Integrated</option>
        <option value="dedicated">Dedicated</option>
      </select>

      {/* Rating */}
      <input
        type="number"
        min="1"
        max="5"
        step="0.1"
        placeholder="Min Rating"
        className={inputClass}
        value={localFilters.minRating}
        onChange={(e) => handleChange("minRating", e.target.value)}
      />

      {/* Sort */}
      <select
        className={selectClass}
        value={localFilters.sort}
        onChange={(e) => handleChange("sort", e.target.value)}
      >
        <option value="">Default Sort</option>
        <option value="price_asc">Price: Low → High</option>
        <option value="price_desc">Price: High → Low</option>
        <option value="rating">Rating: Best First</option>
        <option value="name">Name: A → Z</option>
      </select>

      {/* Buttons */}
      <div className="flex gap-3 mt-2">
        <button
          onClick={applyFilters}
          className="px-5 py-2 primary text-white rounded-lg text-sm font-medium hover:brightness-105 active:scale-95 transition cursor-pointer"
        >
          Apply
        </button>
        <button
          onClick={clearFilters}
          className="px-5 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 active:scale-95 transition cursor-pointer"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default Filter;

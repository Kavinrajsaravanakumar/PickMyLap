import React from "react";
import { Link } from "react-router-dom";
import { useCompare } from "../context/CompareContext";
import Footer from "../components/Footer";

const specRows = [
  { label: "Brand", fn: (l) => l.brand },
  { label: "Series", fn: (l) => l.series },
  { label: "Price", fn: (l) => `₹${l.price.toLocaleString()}`, highlight: "min" },
  { label: "Rating", fn: (l) => `${l.rating} ★`, highlight: "max" },
  { label: "Processor", fn: (l) => `${l.processor.brand} ${l.processor.model}` },
  { label: "Cores / Threads", fn: (l) => `${l.processor.cores} / ${l.processor.threads}` },
  { label: "Base / Boost Clock", fn: (l) => `${l.processor.baseClock} / ${l.processor.boostClock}` },
  { label: "RAM", fn: (l) => `${l.ram.sizeGB}GB ${l.ram.type}`, highlight: "max" },
  { label: "RAM Speed", fn: (l) => l.ram.speedMHz ? `${l.ram.speedMHz} MHz` : "—" },
  { label: "Storage", fn: (l) => l.storage.map((s) => `${s.sizeGB}GB ${s.type}`).join(", ") },
  { label: "GPU Type", fn: (l) => l.graphics.type },
  { label: "GPU Model", fn: (l) => l.graphics.model },
  { label: "VRAM", fn: (l) => l.graphics.vramGB ? `${l.graphics.vramGB}GB` : "—" },
  { label: "Display", fn: (l) => `${l.display.sizeInches}" ${l.display.panel}` },
  { label: "Resolution", fn: (l) => l.display.resolution },
  { label: "Refresh Rate", fn: (l) => l.display.refreshHz ? `${l.display.refreshHz}Hz` : "—", highlight: "max" },
  { label: "Battery", fn: (l) => `${l.battery.capacityWh}Wh`, highlight: "max" },
  { label: "Battery Life", fn: (l) => l.battery.claimedHours || "—" },
  { label: "Fast Charge", fn: (l) => l.battery.fastCharge ? "✅ Yes" : "❌ No" },
  { label: "Weight", fn: (l) => `${l.weightKg} kg`, highlight: "min" },
  { label: "OS", fn: (l) => l.os },
  { label: "Wi-Fi", fn: (l) => l.connectivity.wifi },
  { label: "Bluetooth", fn: (l) => l.connectivity.bluetooth },
  { label: "Ports", fn: (l) => l.ports.join(", ") },
  { label: "Warranty", fn: (l) => `${l.warrantyYears} year(s)` },
];

export default function Compare() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h2 className="text-xl font-semibold">No laptops to compare</h2>
        <p className="text-sm">Add laptops from the Products page to compare them side by side.</p>
        <Link
          to="/products"
          className="primary text-white px-6 py-2 rounded-full text-sm font-medium hover:brightness-105 active:scale-95 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 px-4 md:px-16 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Compare Laptops</h1>
          <button
            onClick={clearCompare}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 active:scale-95 transition cursor-pointer"
          >
            Clear All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {/* Header row with laptop names */}
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left p-4 w-40 bg-gray-50 text-sm font-semibold text-gray-600 sticky left-0 z-10">
                  Specification
                </th>
                {compareList.map((laptop) => (
                  <th key={laptop.laptopId || laptop._id} className="p-4 text-center min-w-[220px]">
                    <div className="flex flex-col items-center gap-2">
                      <Link
                        to={`/product/${laptop.laptopId}`}
                        className="text-base font-semibold text-gray-800 hover:text-violet-600 transition"
                      >
                        {laptop.name}
                      </Link>
                      <p className="text-xs text-gray-500">{laptop.brand}</p>
                      <button
                        onClick={() => removeFromCompare(laptop.laptopId || laptop._id)}
                        className="text-xs text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specRows.map((row, idx) => {
                const values = compareList.map((l) => row.fn(l));

                // Determine best value for highlighting
                let bestIdx = -1;
                if (row.highlight && compareList.length > 1) {
                  const nums = values.map((v) => {
                    const n = parseFloat(String(v).replace(/[₹,]/g, ""));
                    return isNaN(n) ? null : n;
                  });
                  if (nums.some((n) => n !== null)) {
                    const validNums = nums.filter((n) => n !== null);
                    const best = row.highlight === "max"
                      ? Math.max(...validNums)
                      : Math.min(...validNums);
                    bestIdx = nums.indexOf(best);
                  }
                }

                return (
                  <tr
                    key={row.label}
                    className={`border-b border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <td className="p-4 text-sm font-medium text-gray-600 sticky left-0 bg-inherit z-10">
                      {row.label}
                    </td>
                    {values.map((val, i) => (
                      <td
                        key={i}
                        className={`p-4 text-sm text-center ${
                          i === bestIdx ? "text-green-600 font-semibold" : "text-gray-800"
                        }`}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}

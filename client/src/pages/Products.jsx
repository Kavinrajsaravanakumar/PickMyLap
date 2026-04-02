
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { fetchLaptops } from "../api/api";
import Filter from "../components/Filter";
import ListProduct from "../components/ListProduct";
import Footer from "../components/Footer";
import Searchbar from "../components/Searchbar";
import ChatbotSpace from "../components/ChatbotSpace";

export default function ProductsPage() {
  const [filters, setFilters] = useState({
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
  });

  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadLaptops = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filters.name) params.search = filters.name;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.minRating) params.minRating = filters.minRating;
      if (filters.brand) params.brand = filters.brand;
      if (filters.minRam) params.minRam = filters.minRam;
      if (filters.storage) params.storage = filters.storage;
      if (filters.processorBrand) params.processorBrand = filters.processorBrand;
      if (filters.gpuType) params.gpuType = filters.gpuType;
      if (filters.sort) params.sort = filters.sort;

      const { data } = await fetchLaptops(params);
      setLaptops(data.laptops);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to load laptops:", err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    loadLaptops();
  }, [loadLaptops]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <div className="w-1/4 border-r border-gray-400 p-4">
          <Filter filters={filters} setFilters={setFilters} />
        </div>
        <div className="flex-1">
          <div className="mt-5"><Searchbar /></div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500"></div>
            </div>
          ) : (
            <>
              <ListProduct laptops={laptops} />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 py-6">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition"
                  >
                    Prev
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ChatbotSpace />
      <Footer />
    </div>
  );
}

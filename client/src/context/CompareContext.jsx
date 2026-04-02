import React, { createContext, useContext, useState } from "react";

const CompareContext = createContext(null);

export const useCompare = () => useContext(CompareContext);

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);

  const addToCompare = (laptop) => {
    setCompareList((prev) => {
      if (prev.length >= 4) return prev; // max 4
      if (prev.find((l) => (l.laptopId || l._id) === (laptop.laptopId || laptop._id)))
        return prev;
      return [...prev, laptop];
    });
  };

  const removeFromCompare = (id) => {
    setCompareList((prev) =>
      prev.filter((l) => (l.laptopId || l._id) !== id)
    );
  };

  const clearCompare = () => setCompareList([]);

  return (
    <CompareContext.Provider
      value={{ compareList, addToCompare, removeFromCompare, clearCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
}

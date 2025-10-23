// src/components/ProductList.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles.css";

const mockProducts = [
  { id: 1, name: "Apple iPhone", category: "Electronics", price: 999 },
  { id: 2, name: "Banana", category: "Groceries", price: 2 },
  { id: 3, name: "T-shirt", category: "Clothing", price: 20 },
  { id: 4, name: "Headphones", category: "Electronics", price: 199 },
  { id: 5, name: "Jeans", category: "Clothing", price: 49 },
  { id: 6, name: "Laptop", category: "Electronics", price: 1200 },
  { id: 7, name: "Mango", category: "Groceries", price: 3 },
];

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [nameFilter, setNameFilter] = useState(searchParams.get("name") || "");
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "");
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("min")) || 0,
    Number(searchParams.get("max")) || 1000,
  ]);

  useEffect(() => {
    const params = {};
    if (nameFilter) params.name = nameFilter;
    if (categoryFilter) params.category = categoryFilter;
    if (priceRange[0] !== 0) params.min = priceRange[0];
    if (priceRange[1] !== 1000) params.max = priceRange[1];
    setSearchParams(params);
  }, [nameFilter, categoryFilter, priceRange, setSearchParams]);

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(nameFilter.toLowerCase());
      const categoryMatch = categoryFilter ? p.category === categoryFilter : true;
      const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];
      return nameMatch && categoryMatch && priceMatch;
    });
  }, [nameFilter, categoryFilter, priceRange]);

  const categories = [...new Set(mockProducts.map((p) => p.category))];

  return (
    <div className="container">
      <h2>🛍 Product List</h2>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by name..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="range-control">
          <span className="range-label">Price: ${priceRange[0]} - ${priceRange[1]}</span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="range"
              min="0"
              max="1500"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            />
            <input
              type="range"
              min="0"
              max="1500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            />
          </div>
        </div>
      </div>

      <div className="product-grid">
        {filteredProducts.map((p) => (
          <div key={p.id} className="product-card">
            <h4>{p.name}</h4>
            <p>{p.category}</p>
            <p>${p.price}</p>
          </div>
        ))}

        {filteredProducts.length === 0 && <p>No products found.</p>}
      </div>
    </div>
  );
}


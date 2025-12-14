import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import SweetCard from "../components/SweetCard";
import { AuthContext } from "../context/AuthContext";
import { getErrorMessage } from "../api/getErrorMessage";

/**
 * Search page for filtering and searching sweets
 */
const Search = () => {
  const { isAuthenticated } = useContext(AuthContext);

  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  const fetchSweets = async () => {
    if (!isAuthenticated) return;

    setError("");
    setLoading(true);

    try {
      const params = {
        ...(filters.name ? { name: filters.name } : {}),
        ...(filters.category ? { category: filters.category } : {}),
        ...(filters.minPrice ? { minPrice: filters.minPrice } : {}),
        ...(filters.maxPrice ? { maxPrice: filters.maxPrice } : {}),
      };

      const res = await apiClient.get("/sweets/search", { params });
      setSweets(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSweets();
  };

  const handleClear = () => {
    setFilters({ name: "", category: "", minPrice: "", maxPrice: "" });
    setSweets([]);
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="hero">
          <h1>Search Sweets</h1>
          <p className="muted">Please login to search and filter sweets.</p>
          <div className="actions">
            <Link className="btn" to="/login">
              Login
            </Link>
            <Link className="btn btn-secondary" to="/register">
              Create account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2>Search Sweets</h2>
          <p className="muted">Filter sweets by name, category, or price range.</p>
        </div>
      </div>

      <form className="card" onSubmit={handleSearch}>
        <h3>Search / Filter</h3>
        <div className="grid">
          <label className="field">
            <span>Name</span>
            <input
              placeholder="e.g. Ladoo"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Category</span>
            <input
              placeholder="e.g. Indian"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Min price</span>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Max price</span>
            <input
              type="number"
              placeholder="999"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            />
          </label>
        </div>

        <div className="actions">
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
          <button className="btn btn-secondary" type="button" onClick={handleClear}>
            Clear
          </button>
        </div>

        {error && <p className="error">{error}</p>}
      </form>

      {loading && <p className="muted">Loading sweets...</p>}

      {!loading && sweets.length > 0 && (
        <div className="page-header">
          <div>
            <h3>Search Results ({sweets.length})</h3>
          </div>
        </div>
      )}

      <div className="grid cards">
        {sweets.map((sweet) => (
          <SweetCard key={sweet._id} sweet={sweet} refresh={fetchSweets} />
        ))}
      </div>

      {!loading && sweets.length === 0 && filters.name && (
        <p className="muted">No sweets found matching your search criteria.</p>
      )}

      {!loading && sweets.length === 0 && !filters.name && !filters.category && !filters.minPrice && !filters.maxPrice && (
        <p className="muted">Enter search criteria above to find sweets.</p>
      )}
    </div>
  );
};

export default Search;


import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import SweetCard from "../components/SweetCard";
import { AuthContext } from "../context/AuthContext";
import { getErrorMessage } from "../api/getErrorMessage";

/**
 * Dashboard displays all available sweets
 */
const Dashboard = () => {
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

  const hasFilters = useMemo(() => {
    return Boolean(filters.name || filters.category || filters.minPrice || filters.maxPrice);
  }, [filters]);

  const fetchSweets = async () => {
    if (!isAuthenticated) return;

    setError("");
    setLoading(true);

    try {
      const path = hasFilters ? "/sweets/search" : "/sweets";
      const params = hasFilters
        ? {
            ...(filters.name ? { name: filters.name } : {}),
            ...(filters.category ? { category: filters.category } : {}),
            ...(filters.minPrice ? { minPrice: filters.minPrice } : {}),
            ...(filters.maxPrice ? { maxPrice: filters.maxPrice } : {}),
          }
        : undefined;

      const res = await apiClient.get(path, { params });
      setSweets(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, hasFilters]);

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="hero">
          <h1>DeliciousSweets</h1>
          <p className="muted">
            Explore our sweets catalog, search by category/price, and purchase instantly.
          </p>
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
          <h2>Available Sweets</h2>
          <p className="muted">Search, filter, and purchase while stocks last.</p>
        </div>
      </div>

      <div className="card">
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
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Max price</span>
            <input
              placeholder="999"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            />
          </label>
        </div>

        <div className="actions">
          <button className="btn" type="button" onClick={fetchSweets} disabled={loading}>
            {loading ? "Searching..." : "Apply"}
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => setFilters({ name: "", category: "", minPrice: "", maxPrice: "" })}
          >
            Clear
          </button>
        </div>

        {error && <p className="error">{error}</p>}
      </div>

      {loading && <p className="muted">Loading sweets...</p>}

      <div className="grid cards">
        {sweets.map((sweet) => (
          <SweetCard key={sweet._id} sweet={sweet} refresh={fetchSweets} />
        ))}
      </div>

      {!loading && sweets.length === 0 && <p className="muted">No sweets found.</p>}
    </div>
  );
};

export default Dashboard;

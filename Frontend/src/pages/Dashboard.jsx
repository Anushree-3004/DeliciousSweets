import { useContext, useEffect, useState } from "react";
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

  const fetchSweets = async () => {
    if (!isAuthenticated) return;

    setError("");
    setLoading(true);

    try {
      const res = await apiClient.get("/sweets");
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
  }, [isAuthenticated]);

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
          <p className="muted">Browse all available sweets and purchase while stocks last.</p>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      {loading && <p className="muted">Loading sweets...</p>}

      <div className="grid cards">
        {sweets.map((sweet) => (
          <SweetCard key={sweet._id} sweet={sweet} refresh={fetchSweets} />
        ))}
      </div>

      {!loading && sweets.length === 0 && <p className="muted">No sweets available.</p>}
    </div>
  );
};

export default Dashboard;


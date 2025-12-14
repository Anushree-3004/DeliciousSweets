import { useContext, useState } from "react";
import apiClient from "../api/apiClient";
import { getErrorMessage } from "../api/getErrorMessage";
import { AuthContext } from "../context/AuthContext";

/**
 * Displays a single sweet
 * Includes purchase button (admin only)
 */
const SweetCard = ({ sweet, refresh }) => {
  const { role } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePurchase = async () => {
    setError("");
    setLoading(true);

    try {
      await apiClient.post(`/sweets/${sweet._id}/purchase`, { quantity: 1 });
      refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-row">
        <h3>{sweet.name}</h3>
        <span className="badge">{sweet.category}</span>
      </div>

      <p>Price: ₹{sweet.price}</p>
      <p>Stock: {sweet.quantity}</p>
      <p className="muted" style={{ fontSize: "12px", marginTop: "4px" }}>
        ID: {sweet._id}
      </p>

      {error && <p className="error">{error}</p>}

      {role === "admin" && (
        <button
          className="btn"
          onClick={handlePurchase}
          disabled={loading || sweet.quantity === 0}
        >
          {sweet.quantity === 0 ? "Out of stock" : loading ? "Purchasing..." : "Purchase"}
        </button>
      )}

      {role !== "admin" && (
        <p className="muted" style={{ fontSize: "14px", marginTop: "8px" }}>
          Admin only: Purchase
        </p>
      )}
    </div>
  );
};

export default SweetCard;

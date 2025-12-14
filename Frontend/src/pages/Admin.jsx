import { useContext, useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { AuthContext } from "../context/AuthContext";
import { getErrorMessage } from "../api/getErrorMessage";

/**
 * Admin page to add/update/delete/restock sweets
 */
const Admin = () => {
  const { role } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });

  const [sweets, setSweets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSweets = async () => {
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
    if (role === "admin") {
      fetchSweets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await apiClient.post("/sweets", {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
      });
      setFormData({ name: "", category: "", price: "", quantity: "" });
      await fetchSweets();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const updateSweet = async (id, patch) => {
    setError("");

    try {
      await apiClient.put(`/sweets/${id}`, patch);
      await fetchSweets();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const deleteSweet = async (id) => {
    setError("");

    try {
      await apiClient.delete(`/sweets/${id}`);
      await fetchSweets();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const restockSweet = async (id) => {
    setError("");

    try {
      await apiClient.post(`/sweets/${id}/restock`, { quantity: 1 });
      await fetchSweets();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (role !== "admin") {
    return (
      <div className="container">
        <h2>Admin</h2>
        <p className="error">Admin access required.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Admin</h2>

      {error && <p className="error">{error}</p>}

      <form className="card" onSubmit={handleSubmit}>
        <h3>Add Sweet</h3>

        <div className="grid">
          <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
          <input
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
          />
          <input name="price" placeholder="Price" value={formData.price} onChange={handleChange} />
          <input
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>

        <button className="btn" type="submit">
          Add Sweet
        </button>
      </form>

      <div className="card">
        <div className="card-row">
          <h3>Manage Sweets</h3>
          <button className="btn btn-secondary" type="button" onClick={fetchSweets}>
            Refresh
          </button>
        </div>

        {loading && <p>Loading...</p>}

        {sweets.map((s) => (
          <div key={s._id} className="row">
            <div className="row-main">
              <strong>{s.name}</strong>
              <span className="muted">({s.category})</span>
              <div className="muted">₹{s.price} • Stock: {s.quantity}</div>
            </div>

            <div className="row-actions">
              <button className="btn btn-secondary" type="button" onClick={() => restockSweet(s._id)}>
                +1 Stock
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => updateSweet(s._id, { price: s.price + 1 })}
              >
                +₹1
              </button>
              <button className="btn btn-danger" type="button" onClick={() => deleteSweet(s._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}

        {!loading && sweets.length === 0 && <p>No sweets yet.</p>}
      </div>
    </div>
  );
};

export default Admin;

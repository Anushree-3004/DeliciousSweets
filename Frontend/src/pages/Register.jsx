import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { getErrorMessage } from "../api/getErrorMessage";

/**
 * User registration form
 */
const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiClient.post("/auth/register", {
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-wrap">
        <form className="card auth-card" onSubmit={handleSubmit}>
          <h2>Create account</h2>
          <p className="muted">Register to view inventory and make purchases.</p>

          {error && <p className="error">{error}</p>}

          <label className="field">
            <span>Name</span>
            <input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

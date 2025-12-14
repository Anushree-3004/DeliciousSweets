import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * Simple navigation bar
 * Shows Admin link only for admins
 */
const Navbar = () => {
  const { role, isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink className="brand" to="/">
          DeliciousSweets
        </NavLink>
      </div>

      <div className="navbar-right">
        <NavLink to="/" className={({ isActive }) => (isActive ? "navlink active" : "navlink")}>
          Dashboard
        </NavLink>

        {!isAuthenticated && (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "navlink active" : "navlink")}
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) => (isActive ? "navlink active" : "navlink")}
            >
              Register
            </NavLink>
          </>
        )}

        {role === "admin" && (
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? "navlink active" : "navlink")}
          >
            Admin
          </NavLink>
        )}

        {isAuthenticated && (
          <button className="btn" type="button" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

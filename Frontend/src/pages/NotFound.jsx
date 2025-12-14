import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container">
      <div className="hero">
        <h2>Page not found</h2>
        <p className="muted">This route doesn’t exist in the frontend app.</p>
        <div className="actions">
          <Link className="btn" to="/">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

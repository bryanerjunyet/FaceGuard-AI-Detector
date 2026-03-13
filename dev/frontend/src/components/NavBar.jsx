import { Link, NavLink } from "react-router-dom";
import logo from "@/assets/logo.png";

function activeStyle({ isActive }) {
  return isActive ? "nav-link nav-link-active" : "nav-link";
}

export default function NavBar() {
  return (
    <header className="top-nav">
      <Link to="/" className="brand">
        <img src={logo} alt="FaceGuard Logo" className="brand-mark" />
      </Link>
      <nav className="menu">
        <NavLink to="/" className={activeStyle}>
          Home
        </NavLink>
        <NavLink to="/upload" className={activeStyle}>
          Detector
        </NavLink>
        <NavLink to="/guide" className={activeStyle}>
          Guide
        </NavLink>
      </nav>
      <Link to="/signin" className="secondary-btn">
        Sign In
      </Link>
    </header>
  );
}


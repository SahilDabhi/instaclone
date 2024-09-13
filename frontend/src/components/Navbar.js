import "./Navbar.css";
import logo from "../img/logo.png";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <img src={logo} className="logo" alt="logo" />
      <ul>
        <Link to="/signup">
          <li>SignUp</li>
        </Link>
        <Link to="/login">
          <li>Login</li>
        </Link>
        <Link to="/profile">
          <li>Profile</li>
        </Link>
        <Link to="/uploadstatus">
          <li>Upload status</li>
        </Link>
      </ul>
    </nav>
  );
}

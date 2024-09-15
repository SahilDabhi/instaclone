import "./Navbar.css";
import { useContext } from "react";
import logo from "../img/logo.png";
import { Link } from "react-router-dom";
import { LoginContext } from "../context/loginContext.js";

export default function Navbar({ login }) {
  const { setModalOpen } = useContext(LoginContext);
  const loginStatus = () => {
    const token = localStorage.getItem("token");
    if (login || token) {
      return [
        <>
          <Link style={{ marginLeft: "20px" }} to="/myfollowing">
            My Following
          </Link>
          <Link to="/profile">
            <li>Profile</li>
          </Link>
          <Link to="/uploadstatus">Create Post</Link>
          <Link to={""}>
            <li>
              <span onClick={() => setModalOpen(true)}>Log Out</span>
            </li>
          </Link>
        </>,
      ];
    } else {
      return [
        <>
          <Link to="/signup">
            <li>SignUp</li>
          </Link>
          <Link to="/login">
            <li>SignIn</li>
          </Link>
        </>,
      ];
    }
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={logo} className="logo" alt="" />
      </Link>
      <ul className="nav-menu">{loginStatus()}</ul>
    </div>
  );
}

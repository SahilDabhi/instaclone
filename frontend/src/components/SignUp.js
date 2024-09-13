import logo from "../img/logo.png";
import "./SignUp.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/api/user/signup",
        {
          username,
          fullName,
          email,
          password,
        }
      );

      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="signUp">
      <div className="form-container">
        <div className="form">
          <img className="signUpLogo" src={logo} alt="Logo" />
          <p className="loginPara">
            Sign up to see photos and videos <br /> from your friends
          </p>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="email"
                id="email"
                placeholder="Email"
              />
            </div>
            <div>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                name="fullName"
                id="fullName"
                placeholder="Full Name"
              />
            </div>
            <div>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                name="username"
                id="username"
                placeholder="Username"
              />
            </div>
            <div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                name="password"
                id="password"
                placeholder="Password"
              />
            </div>
            <p
              className="loginPara"
              style={{ fontSize: "12px", margin: "3px 0px" }}
            >
              By signing up, you agree to our Terms, <br /> privacy policy and
              cookies policy.
            </p>
            <input type="submit" id="submit-btn" value="Sign Up" />
          </form>
        </div>
        <div className="form2">
          Already have an account?
          <Link to="/login">
            <span style={{ color: "blue", cursor: "pointer" }}>Login in</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

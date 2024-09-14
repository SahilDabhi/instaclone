import "./Login.css";
import logo from "../img/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { LoginContext } from "../context/loginContext.js";
import axios from "axios";

export default function SignIn() {
  const { setUserLogin } = useContext(LoginContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    const emailRegex = /^[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email.");
      return;
    }
    setError("");

    // Send the data to the server
    const loginUrl = "http://localhost:3001/api/user/login";
    try {
      const response = await axios.post(
        loginUrl,
        {
          email,
          password,
        },
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(response);

      setUserLogin(true);
      await localStorage.setItem("token", response.data.token);
      await localStorage.setItem("user", JSON.stringify(response.data.user));
      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="signIn">
      <div>
        <div className="loginForm">
          <img className="signUpLogo" src={logo} alt="Logo" />
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="error">{error}</p>}
            <input type="submit" id="login-btn" value="Sign In" />
          </form>
        </div>
        <div className="loginForm2">
          Don't have an account?
          <Link to="/signup">
            <span style={{ color: "blue", cursor: "pointer" }}>Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

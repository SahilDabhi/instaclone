import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { LoginContext } from "./context/loginContext.js";
import Navbar from "./components/Navbar.js";
import Home from "./components/Home.js";
import SignUp from "./components/SignUp.js";
import Login from "./components/Login.js";
import Profile from "./components/Profile.js";
import Status from "./components/Status.js";
import Modal from "./components/Modal.js";
import UserProfile from "./components/UserProfile.js";
import MyFollowing from "./components/MyFollowing.js";

function App() {
  const [userLogin, setUserLogin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <BrowserRouter>
      <div className="App">
        <LoginContext.Provider value={{ setUserLogin, setModalOpen }}>
          <Navbar login={userLogin} />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/myfollowing" element={<MyFollowing />}></Route>
            <Route path="/uploadstatus" element={<Status />}></Route>
            <Route exact path="/profile" element={<Profile />}></Route>
            <Route path="/profile/:userid" element={<UserProfile />}></Route>
          </Routes>
          {modalOpen && <Modal setModalOpen={setModalOpen} />}
        </LoginContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;

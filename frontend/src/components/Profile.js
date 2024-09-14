import "./Profile.css";
import { useEffect, useState } from "react";
import PostDetail from "./PostDetails.js";

export default function Profile() {
  const [pic, setPic] = useState([]);
  const [show, setShow] = useState(false);
  const [posts, setPosts] = useState([]);

  const toggleDetails = (post) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setPosts(post);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/status/mystatus",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        const result = await response.json();
        setPic(result);
        // console.log(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="profile">
      {/* Profile frame */}
      <div className="profile-frame">
        {/* profile-pic */}
        <div className="profile-pic">
          <img
            src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
            alt=""
          />
        </div>
        {/* profile-data */}
        <div className="profile-data">
          <h1>{JSON.parse(localStorage.getItem("user"))["username"]}</h1>
          <div className="profile-info" style={{ display: "flex" }}>
            <p>{pic.length} posts</p>
            <p>5 followers</p>
            <p>5 following</p>
          </div>
        </div>
      </div>
      <hr
        style={{
          width: "80%",
          opacity: "0.8",
          margin: "25px auto",
        }}
      />
      {/* Gallery */}
      <div className="gallery">
        {pic.map((pics) => {
          return (
            <img
              key={pics._id}
              src={pics.status}
              onClick={() => {
                toggleDetails(pics);
              }}
              className="item"
              alt=""
            />
          );
        })}
      </div>
      {show && <PostDetail item={posts} toggleDetails={toggleDetails} />}
    </div>
  );
}

import "./Profile.css";
import { useEffect, useState } from "react";
import PostDetail from "./PostDetails.js";
import ProfilePic from "./ProfilePic.js";

export default function Profile() {
  const [pic, setPic] = useState([]);
  const [show, setShow] = useState(false);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState("");
  const [changePic, setChangePic] = useState(false);

  const toggleDetails = (post) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setPosts(post);
    }
  };

  const changeprofile = () => {
    if (changePic) {
      setChangePic(false);
    } else {
      setChangePic(true);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/user/${
            JSON.parse(localStorage.getItem("user"))._id
          }`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        const result = await response.json();
        setPic(result);
        console.log(result);
        setPic(result.post);
        setUser(result.user);
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
          <img onClick={changeprofile} src={user.avatar} alt="profile" />
        </div>
        {/* profile-data */}
        <div className="profile-data">
          <h1>{JSON.parse(localStorage.getItem("user"))["username"]}</h1>
          <div className="profile-info" style={{ display: "flex" }}>
            <p>{pic && pic.length} posts</p>
            <p>{user && user.followers.length} followers</p>
            <p>{user && user.following.length} following</p>
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
        {pic &&
          pic.map((pics) => {
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
      {changePic && <ProfilePic changeprofile={changeprofile} />}
    </div>
  );
}

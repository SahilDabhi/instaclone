import React, { useEffect, useState } from "react";
// import PostDetail from "./PostDetail";
import "./Profile.css";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  const { userid } = useParams();
  const [isFollow, setIsFollow] = useState(false);
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/user/${userid}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        console.log(result);

        setUser(result.user);
        setPosts(result.posts);

        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (
          result.user &&
          result.user.followers &&
          result.user.followers.includes(currentUser._id)
        ) {
          setIsFollow(true);
        }
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchUserData();
  }, [isFollow]);

  const followUser = (followId) => {
    fetch("http://localhost:3001/api/user/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        followId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUser(data);
        setIsFollow(true);
      });
  };

  const unfollowUser = (unfollowId) => {
    fetch("http://localhost:3001/api/user/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        unfollowId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUser(data);
        setIsFollow(false);
      });
  };

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
        <div className="pofile-data">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h1>{user.username}</h1>
            <button
              className="followBtn"
              onClick={() => {
                if (isFollow) {
                  unfollowUser(user._id);
                } else {
                  followUser(user._id);
                }
              }}
            >
              {isFollow ? "Unfollow" : "Follow"}
            </button>
          </div>
          <div className="profile-info" style={{ display: "flex" }}>
            <p>{(posts && posts.length) || 0} posts</p>
            <p>
              {(user && user.followers && user.followers.length) || 0} followers
            </p>
            <p>
              {(user && user.following && user.following.length) || 0} following
            </p>
          </div>
        </div>
      </div>
      <hr
        style={{
          width: "90%",

          opacity: "0.8",
          margin: "25px auto",
        }}
      />
      {/* Gallery */}
      <div className="gallery">
        {posts.map((pics) => {
          return (
            <img
              key={pics._id}
              src={pics.status}
              // onClick={() => {
              //     toggleDetails(pics)
              // }}
              className="item"
              alt=""
            />
          );
        })}
      </div>
      {/* {show &&
        <PostDetail item={posts} toggleDetails={toggleDetails} />
      } */}
    </div>
  );
}

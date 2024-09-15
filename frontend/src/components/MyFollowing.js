import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function MyFollowing() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signup");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/user/myfollowing", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch data");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [navigate]);

  // to show and hide comments
  const toggleComment = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setItem(posts);
    }
  };

  const likePost = async (id) => {
    try {
      const response = await fetch("http://localhost:3001/api/status/like", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          postId: id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      const newData = data.map((posts) => {
        if (posts._id === result._id) {
          return result;
        } else {
          return posts;
        }
      });

      console.log(newData);
      setData(newData);
      console.log(result);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const unlikePost = async (id) => {
    try {
      const response = await fetch("http://localhost:3001/api/status/unlike", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          postId: id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      const newData = data.map((posts) => {
        if (posts._id === result._id) {
          return result;
        } else {
          return posts;
        }
      });

      setData(newData);
      console.log(result);
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  // function to make comment
  const makeComment = async (text, id) => {
    try {
      const response = await fetch("http://localhost:3001/api/status/comment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          comment: text,
          postId: id,
          postedBy: JSON.parse(localStorage.getItem("user"))._id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      const newData = data.map((posts) => {
        if (posts._id === result._id) {
          return result;
        } else {
          return posts;
        }
      });

      setData(newData);
      setComment("");

      console.log(result);
    } catch (error) {
      console.error("Error making comment:", error);
    }
  };

  return (
    <div className="home">
      {/* card */}
      {data &&
        data.map((posts) => {
          return (
            <div className="card">
              {/* card header */}
              <div className="card-header">
                <div className="card-pic">
                  <img
                    src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                    alt=""
                  />
                </div>
                <h5>
                  <Link to={`/profile/${posts.postedBy._id}`}>
                    {posts.postedBy.username}
                  </Link>
                </h5>
              </div>
              {/* card image */}
              <div className="card-image">
                <img src={posts.status} alt="" />
              </div>

              {/* card content */}
              <div className="card-content">
                {posts.likedBy.includes(
                  JSON.parse(localStorage.getItem("user"))._id
                ) ? (
                  <span
                    className="material-symbols-outlined material-symbols-outlined-red"
                    onClick={() => {
                      // console.log(posts._id);
                      unlikePost(posts._id);
                    }}
                  >
                    favorite
                  </span>
                ) : (
                  <span
                    className="material-symbols-outlined"
                    onClick={() => {
                      // console.log(posts._id);
                      likePost(posts._id);
                    }}
                  >
                    favorite
                  </span>
                )}

                <p>{posts.likedBy.length} Likes</p>
                <p>{posts.statusCaption} </p>
                <p
                  style={{ fontWeight: "bold", cursor: "pointer" }}
                  onClick={() => {
                    toggleComment(posts);
                  }}
                >
                  View all comments
                </p>
              </div>

              {/* add Comment */}
              <div className="add-comment">
                <span className="material-symbols-outlined">mood</span>
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                />
                <button
                  className="comment"
                  onClick={() => {
                    makeComment(comment, posts._id);
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          );
        })}

      {/* show Comment */}
      {show && (
        <div className="showComment">
          <div className="container">
            <div className="postPic">
              <img src={item.status} alt="" />
            </div>
            <div className="details">
              {/* card header */}
              <div
                className="card-header"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                <div className="card-pic">
                  <img
                    src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                    alt=""
                  />
                </div>
                <h5>{item.postedBy.username}</h5>
              </div>

              {/* commentSection */}
              <div
                className="comment-section"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                {item.comments.map((comment) => {
                  return (
                    <p className="comm">
                      <span
                        className="commenter"
                        style={{ fontWeight: "bolder" }}
                      >
                        {comment.user.username}{" "}
                      </span>
                      <span className="commentText">{comment.comment}</span>
                    </p>
                  );
                })}
              </div>

              {/* card content */}
              <div className="card-content">
                <p>{item.likedBy.length} Likes</p>
                <p>{item.body}</p>
              </div>

              {/* add Comment */}
              <div className="add-comment">
                <span className="material-symbols-outlined">mood</span>
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                />
                <button
                  className="comment"
                  onClick={() => {
                    makeComment(comment, item._id);
                    toggleComment();
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
          <div
            className="close-comment"
            onClick={() => {
              toggleComment();
            }}
          >
            <span className="material-symbols-outlined material-symbols-outlined-comment">
              close
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

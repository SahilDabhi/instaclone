import React, { useState, useEffect } from "react";
import "./Home.css";
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signup");
          return;
        }

        const response = await fetch(
          "http://localhost:3001/api/status/allstatus",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setData(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      }
    };

    fetchData();
  }, [navigate]);

  const updatePost = async (id, endpoint) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3001/api/status/${endpoint}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ statusId: id }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      const result = await response.json();

      setData((prevData) =>
        prevData.map((post) =>
          post._id === result._id ? { ...post, ...result } : post
        )
      );
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };
  const toggleComment = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setItem(posts);
    }
  };

  const makeComment = async (text, id) => {
    try {
      const response = await fetch("http://localhost:3001/api/status/comment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          statusId: id,
          comment: text,
          postedBy: JSON.parse(localStorage.getItem("user"))._id,
        }),
      });

      console.log(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="home">
      <div className="card-content">
        {data &&
          data.map((status) => (
            <div className="card" key={status._id}>
              <div className="card-pic">
                <img key={status._id} src={status.postedBy.avatar} alt="" />
                <h5>
                  <Link to={`/profile/${status.postedBy._id}`}>
                    {status.postedBy.username}
                  </Link>
                </h5>
              </div>
              <div className="card-image">
                <img src={status.status} alt={status.statusCaption} />
              </div>
              <div className="card-content">
                {status.likedBy.includes(
                  JSON.parse(localStorage.getItem("user"))._id
                ) ? (
                  <span
                    className="material-symbols-outlined material-symbols-outlined-red"
                    onClick={() => updatePost(status._id, "unlike")}
                  >
                    favorite
                  </span>
                ) : (
                  <span
                    className="material-symbols-outlined"
                    onClick={() => updatePost(status._id, "like")}
                  >
                    favorite
                  </span>
                )}
                <p>{status.likedBy.length} Likes</p>
                <p>{status.statusCaption}</p>
              </div>

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
                    makeComment(comment, data._id);
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          ))}
        {show && (
          <div className="showComment">
            <div className="container">
              <div className="postPic">
                <img src={item.photo} alt="" />
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
                  <h5>{item.postedBy.name}</h5>
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
                          {comment.postedBy.username}{" "}
                        </span>
                        <span className="commentText">{comment.comment}</span>
                      </p>
                    );
                  })}
                </div>

                {/* card content */}
                <div className="card-content">
                  <p>{item.likes.length} Likes</p>
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
          </div>
        )}
      </div>
    </div>
  );
}

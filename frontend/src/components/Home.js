import React, { useState, useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

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

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="home">
      <div className="card-content">
        {data &&
          data.map((status) => (
            <div className="card" key={status._id}>
              <h5>{status.postedBy.username}</h5>
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
                <input type="text" placeholder="Add a comment" />
                <button className="comment">Post</button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

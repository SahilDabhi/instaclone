import "./status.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Status() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const loadFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const output = document.getElementById("output");
      output.src = URL.createObjectURL(file);
      output.onload = () => URL.revokeObjectURL(output.src);
      setImage(file); // Update state with the selected file
    }
  };

  const postStatus = async () => {
    if (!image || !caption) {
      alert("Please add an image and caption.");
      return;
    }

    const formData = new FormData();
    formData.append("status", image);
    formData.append("statusCaption", caption);

    const apiUrl = "http://localhost:3001/api/status/createstatus";

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Status posted successfully:", response.data);
      alert("Status posted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error posting status:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="createPost">
      <div className="post-header">
        <h4 style={{ margin: "3px auto" }}>Create New Status</h4>
        <button id="post-btn" onClick={postStatus}>
          Share
        </button>
      </div>
      <div className="main-div">
        <img
          id="output"
          src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png"
          alt="Preview"
          style={{ width: "100%", maxHeight: "400px" }}
        />
        <input type="file" accept="image/*" onChange={loadFile} />
      </div>
      <div className="details">
        <div className="card-header">
          <div className="card-pic">
            <img
              src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
              alt="User"
              style={{ width: "40px", height: "40px", borderRadius: "50%" }}
            />
          </div>
          <h5>User</h5>
        </div>
        <textarea
          placeholder="Write a caption...."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
}

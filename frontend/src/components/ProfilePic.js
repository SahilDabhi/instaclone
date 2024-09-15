import React, { useState, useEffect, useRef } from "react";

export default function ProfilePic({ changeprofile }) {
  const hiddenFileInput = useRef(null);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  // posting image to cloudinary
  const loadFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const output = document.getElementById("output");
      output.src = URL.createObjectURL(file);
      output.onload = () => URL.revokeObjectURL(output.src);
      setUrl(file);
      console.log(file); // Update state with the selected file
    }
  };

  const postPic = () => {
    // saving post to mongodb
    fetch("http://localhost:3001/api/user/updateprofilepic", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        loadFile();
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    if (image) {
      postPic();
    }
  }, [image]);

  return (
    <div className="profilePic darkBg">
      <div className="changePic centered">
        <div>
          <h2>Change Profile Photo</h2>
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            className="upload-btn"
            style={{ color: "#1EA1F7" }}
            onClick={handleClick}
          >
            Upload Photo
          </button>
          <input
            type="file"
            ref={hiddenFileInput}
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button className="upload-btn" style={{ color: "#ED4956" }}>
            {" "}
            Remove Current Photo
          </button>
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
            }}
            onClick={changeprofile}
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  );
}

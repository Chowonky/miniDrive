import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    setUser(loggedInUser);
    fetchFiles(loggedInUser.phonenumber);
  }, []);

  const fetchFiles = async (phoneNumber) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await fetch(`http://localhost:3000/files/${phoneNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setFiles(data.files);
    } catch (error) {
      toast.error("Failed to load files");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      toast.error("No file selected");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      if (file.size / 1024 > 1048576) toast.error("File too big (Limit: 1GB)!");

      const fileObj = {
        name: file.name,
        size: Math.ceil(file.size / 1024) + " KB",
        type: file.type,
        content: reader.result,
        phoneNumber: user.phonenumber,
      };

      try {
        const token = JSON.parse(localStorage.getItem("token"));
        console.log("sent token: ", token);
        const res = await fetch("http://localhost:3000/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(fileObj),
        });

        if (res.ok) {
          toast.success("File uploaded successfully");
          fetchFiles(user.phonenumber);
        } else {
          toast.error("Failed to upload");
        }
      } catch (error) {
        toast.error("Upload failed");
      }
    };
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const res = await fetch(`http://localhost:3000/files/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        toast.success("Deleted");
        setFiles((prev) => prev.filter((f) => f.id !== id));
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      toast.error("Delete error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");

    toast.success("Logged out successfully");

    navigate("/login");
  };
  if (!user) return null;

  return (
    <div className="dashboard-box">
      <h2>
        Name: {user.fname} {user.lname}
      </h2>
      <h2>Age: {user.age}</h2>
      <h2>Phone Number: {user.phonenumber}</h2>

      <br />
      <input className="browse-btn" type="file" onChange={handleFileChange} />
      <button className="upload-btn" onClick={handleUpload}>
        Upload
      </button>

      <br />
      <br />
      <div id="display-uploaded-files">
        {files.length === 0 && <p>No files uploaded yet.</p>}
        {files.map((f) => {
          const date = new Date(f.uploaddate).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          return (
            <div key={f.id} className="uploaded-files">
              <b>{f.name}</b> ({f.size}) {date} <br />
              <a className="download-btn" href={f.content} download={f.name}>
                Download
              </a>
              <button className="delete-btn" onClick={() => handleDelete(f.id)}>
                Delete
              </button>
            </div>
          );
        })}
      </div>
      <br />
      <br />
      <div className="buttons">
        <Link className="link-btn" to="/">
          Back
        </Link>
        <button className="btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

import "./Home.scss";

const Home = () => {
  const navigate = useNavigate();

  

  const username = localStorage.getItem("username") || "Unknown User";
  const addNewDoc = (e) => {
    e.preventDefault();
    const userid = localStorage.getItem("userid");
    const title = e.target.elements.title.value;
    const description = e.target.elements.description.value;

    if (!title || !description) {
      alert("Title and Description are required");
      return;
    }

    if (!userid) {
      alert("Please Login to add Document");
      navigate("/login");
      return;
    }

    axios
      .post("http://localhost:3000/api/documents/add", {
        userid: userid,
        title: title,
        description: description,
      })
      .then((res) => {
        if (res.status === 200 && res.statusText === "OK") {
          alert("Document added successfully");
          e.target.reset();
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          alert("Something wents wrong, Unable to add document");
        }
      });
  };
  return (
    <>
      <nav className="nav-bar">
        <a className="navbar-brand">Home</a>
        <h3 className="mb-0">{username}</h3>
        <button className="btn btn-outline-success" type="submit">
          Logout
        </button>
      </nav>

      <div className="doc-box">
        <form onSubmit={addNewDoc} className="document-add ">
          <input
            className="form-control"
            type="text"
            placeholder="title"
            name="title"
            required
          />
          <input
            className="form-control"
            type="text"
            placeholder="description"
            name="description"
            required
          />
          <button className="btn btn-primary">Add</button>
        </form>

        <div className="doc-list">
          <ol className="list-group list-group-numbered">
            <li className="list-group-item d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto">
                <div className="fw-bold">Subheading</div>
                Cras justo odio
              </div>
              <span className="badge bg-primary rounded-pill">14</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto">
                <div className="fw-bold">Subheading</div>
                Cras justo odio
              </div>
              <span className="badge bg-primary rounded-pill">14</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto">
                <div className="fw-bold">Subheading</div>
                Cras justo odio
              </div>
              <span className="badge bg-primary rounded-pill">14</span>
            </li>
          </ol>
        </div>
      </div>
    </>
  );
};

export default Home;

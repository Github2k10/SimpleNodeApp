import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

import "./Home.scss";

const baseurl = "http://localhost:3000/api";

const Home = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [flag, setFlag] = useState(false);

  const username = localStorage.getItem("username") || "Unknown User";
  const userid = localStorage.getItem("userid");
  const sessionid = localStorage.getItem("sessionid");

  useEffect(() => {
    axios
      .post(`${baseurl}/document/all`, {
        userid: userid,
        sessionid: sessionid,
      })
      .then((res) => {
        setDocuments(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const addNewDoc = (e) => {
    e.preventDefault();
    const title = e.target.elements.title.value.trim();
    const description = e.target.elements.description.value.trim();

    if (
      !title ||
      !description ||
      title.length <= 0 ||
      description.length <= 0
    ) {
      alert("Title and Description are required");
      return;
    }

    if (!userid) {
      alert("Please Login to add Document");
      navigate("/login");
      return;
    }

    axios
      .post(`${baseurl}/document/add`, {
        userid: userid,
        sessionid: sessionid,
        title: title,
        description: description,
      })
      .then((res) => {
        if (res.status === 200 && res.statusText === "OK") {
          setDocuments((prevDocuments) => [...prevDocuments, res.data]);
          e.target.reset();
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          alert("Something wents wrong, Unable to add document");
        }
      });
  };

  const logout = (e) => {
    e.preventDefault();

    axios
      .post(`${baseurl}/logout`, {
        userid: userid,
        sessionid: sessionid,
      })
      .then((res) => {
        if (res.status === 200 && res.statusText === "OK") {
          localStorage.clear();
          alert("Logout");
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          alert("Something wents wrong, Unable logout");
        }
      });
  };

  const deleteButton = (doc) => {
    const requestBody = {
      userid: userid,
      sessionid: sessionid,
      documentid: doc._id,
    };

    axios
      .delete(`${baseurl}/document/delete`, {
        data: requestBody,
      })
      .then((res) => {
        setDocuments(documents.filter((document) => document._id != doc._id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const editButton = (doc) => {
    setFlag(true);
    const documentid = doc._id;
    localStorage.setItem("documentid", documentid);
  };

  const editSubmit = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const description = e.target.description.value;
    const documentid = localStorage.getItem("documentid");

    if (title.length <= 0 || description <= 0) {
      alert("Title and Description required");
      return;
    }

    const requestBody = {
      userid: userid,
      sessionid: sessionid,
      documentid: documentid,
      title: title,
      description: description,
    };

    axios
      .put(`${baseurl}/document/edit`, {
        data: requestBody,
      })
      .then((res) => {
        setDocuments(
          documents.map((doc) => {
            if (res.data._id == doc._id) {
              return res.data;
            }

            return doc;
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });

    e.target.reset();
    setFlag(false);
  };

  return (
    <>
      <nav className="nav-bar">
        <a className="navbar-brand">Home</a>
        <h3 className="mb-0">{username}</h3>
        <button className="btn btn-outline-success" onClick={(e) => logout(e)}>
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
            {documents &&
              documents.map((doc) => (
                <li
                  key={doc._id}
                  className="doc-item list-group-item d-flex justify-content-between align-items-start"
                >
                  <div className="doc-dec ms-2 me-auto">
                    <p className="fw-bold">{doc.title}</p>
                    <p>{doc.description}</p>
                  </div>
                  <div className="button">
                    <button
                      className="btn btn-warning"
                      onClick={() => editButton(doc)}
                    >
                      edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteButton(doc)}
                    >
                      delete
                    </button>
                  </div>
                </li>
              ))}
          </ol>
          {flag && (
            <div className="doc-edit">
              <form className="mb-3" onSubmit={(e) => editSubmit(e)}>
                <label htmlFor="exampleInputEmail1" className="form-label">
                  <strong>Title</strong>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  name="title"
                  required
                />

                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    <strong>Description</strong>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputPassword1"
                    name="description"
                    required
                  />
                </div>
                <div>
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="Submit"
                  />
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="Cancel"
                    onClick={() => {
                      setFlag(false);
                    }}
                  />
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;

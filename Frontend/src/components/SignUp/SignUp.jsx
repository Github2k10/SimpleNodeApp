import React from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import "./SignUp.scss";

const SignUp = () => {
  const navigate = useNavigate();

  const isValidPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };
  const submitForm = (e) => {
    e.preventDefault();

    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;

    if (!isValidPassword(password)) {
      alert(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    axios
      .post("http://localhost:3000/api/register", {
        username: username,
        password: password,
      })
      .then((res) => {
        if (res.status === 200 && res.statusText === "OK") {
          const { userid, sessionid, username } = res.data;
          
          localStorage.setItem("userid", userid);
          localStorage.setItem("sessionid", sessionid);
          localStorage.setItem("username", username);
          
          alert("Registered Successfully");
          navigate("/home");
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      });

    e.target.reset();
  };

  return (
    <div className="container" style={{ marginTop: "50px", width: "400px" }}>
      <h2>Sign Up</h2>
      <form className="mb-3" onSubmit={submitForm}>
        <label htmlFor="exampleInputEmail1" className="form-label">
          Username
        </label>
        <input
          type="text"
          className="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          name="username"
          required
        />
        <div id="emailHelp" className="form-text">
          We'll never share your email with anyone else.
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            name="password"
            required
          />
        </div>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
        <input type="submit" className="btn btn-primary" value="Submit" />
      </form>
    </div>
  );
};

export default SignUp;

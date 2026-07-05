import { useState } from "react";
import axios from "axios";
import "./Login.css";

function Login({ loginSuccess, openSignup, openForgotPassword })  {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = () => {
    axios
      .post("http://localhost:8080/api/users/login", {
        email,
        password,
      })
      .then((response) => {
        alert("Login Successful!");
        loginSuccess(response.data);
      })
      .catch(() => {
        alert("Invalid Email or Password");
      });
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <h1>Task Management System</h1>

        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={loginUser}>
          Login
        </button>

    <p
  onClick={openForgotPassword}
  style={{
    color: "#2563eb",
    cursor: "pointer",
    marginTop: "15px",
    fontWeight: "bold"
  }}
>
  Forgot Password?
</p>

<p>
  Don't have an account?{" "}
  <span onClick={openSignup}>
    Sign Up
  </span>
</p>

      </div>

    </div>
  );
}

export default Login;
import { useState } from "react";
import axios from "axios";
import "./Signup.css";

function Signup({ openLogin }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = () => {

    axios
      .post("http://localhost:8080/api/users/register", {
        name,
        email,
        password
      })
      .then(() => {
        alert("Registration Successful!");
        openLogin();
      })
      .catch(() => {
        alert("Registration Failed!");
      });

  };

  return (

    <div className="login-container">

      <div className="login-card">

        <h1>Task Management System</h1>

        <h2>Sign Up</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button onClick={registerUser}>
          Register
        </button>

        <p>
          Already have an account?
          <span onClick={openLogin}> Login</span>
        </p>

      </div>

    </div>

  );

}

export default Signup;
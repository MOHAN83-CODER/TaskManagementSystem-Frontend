import { useState } from "react";
import axios from "axios";

function ForgotPassword({ openLogin }) {

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const resetPassword = () => {

    console.log("Email:", email);
    console.log("New Password:", newPassword);

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/users/forgot-password`,
        {
          email,
          password: newPassword,
        }
      )
      .then(() => {
        alert("Password Updated Successfully!");
        openLogin();
      })
      .catch((error) => {
        console.error(error);
        alert("Email not found!");
      });
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h2>Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button onClick={resetPassword}>
          Update Password
        </button>

        <p>
          <span
            onClick={openLogin}
            style={{ color: "blue", cursor: "pointer" }}
          >
            Back to Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default ForgotPassword;
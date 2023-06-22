import { useState } from "react";
import "./Login.css";
import axios from "axios";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = () => {
    axios
      .post(import.meta.env.VITE_APP_USERS_API_URL + "/login", {
        username: "test",
        password: "test",
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <>
      <label>
        Username:
        <input
          type="text"
          value={form.username}
          onChange={(event) =>
            setForm({ ...form, username: event.target.value })
          }
        />
      </label>
      <label>
        Password:
        <input
          type="text"
          value={form.password}
          onChange={(event) =>
            setForm({ ...form, password: event.target.value })
          }
        />
      </label>
      <input onClick={handleSubmit} type="button" value="Submit" />
    </>
  );
}

export default Login;

import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import api from "../api/api.js";

export default function Login({
  onSuccess,
}: {
  onSuccess: (val: boolean) => void;
}) {
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");

  const sendFormulaire = () => {
    api
      .post("/auth/login", {
        username: username,
        password: password,
      })
      .then((res) => {
        onSuccess(true);
      })
      .catch((err) => setError("Wrong mail or password"));
  };
  return (
    <div
      style={{
        alignSelf: "center",
        width: 500,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Login</h1>
      <Form>
        <Form.Group controlId="form.Username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="Username"
          />
        </Form.Group>
        <Form.Group controlId="form.Password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Password"
          />
        </Form.Group>
        <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
        <Button variant="primary" onClick={() => sendFormulaire()}>
          Login
        </Button>
      </Form>
    </div>
  );
}

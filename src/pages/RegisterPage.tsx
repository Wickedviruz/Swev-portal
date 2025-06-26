import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import styles from "./RegisterPage.module.scss";
import axios from "axios";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await register(username, email, password);
      if (result.success) {
        navigate("/login");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Something went wrong!");
      } else {
        setError("Something went wrong!");
      }
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h2>Create account</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">Create!</button>
          {error && <div className={styles.error}>{error}</div>}
        </form>
        <a href="/login">Already have an account? Log in</a>
      </div>
    </Layout>
  );
};
export default RegisterPage;

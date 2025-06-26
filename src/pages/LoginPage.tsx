import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import styles from "./LoginPage.module.scss"; // Gör en scss-modul!

import axios from "axios"; // Behövs för isAxiosError

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await login(username, password);
      if (result.success) {
        localStorage.setItem("user", JSON.stringify(result.user));
        navigate("/accountmanagement");
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
        <h2>Log in</h2>
        <form onSubmit={handleSubmit}>
          <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit">Log in</button>
          {error && <div className={styles.error}>{error}</div>}
        </form>
        <a href="/register">Create account</a>
      </div>
    </Layout>
  );
};
export default LoginPage;

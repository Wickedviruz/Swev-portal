import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import styles from "./CreateCharacterPage.module.scss"; // <-- Skapa denna fil!

const CreateCharacterPage = () => {
  const [name, setName] = useState("");
  const [vocation, setVocation] = useState("knight");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post("http://localhost:7172/api/character", {
        accountId: user.id,
        name,
        vocation,
      });
      if (res.data.success) {
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
        <h2>Create new character</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            placeholder="Character name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <select value={vocation} onChange={e => setVocation(e.target.value)}>
            <option value="knight">Knight</option>
            <option value="mage">Mage</option>
            <option value="paladin">Paladin</option>
            <option value="druid">Druid</option>
          </select>
          <button type="submit">Create character</button>
          {error && <div className={styles.error}>{error}</div>}
        </form>
        <button className={styles.back} onClick={() => navigate("/accountmanagement")}>Back</button>
      </div>
    </Layout>
  );
};

export default CreateCharacterPage;

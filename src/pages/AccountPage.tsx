import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import styles from "./AccountPage.module.scss";

interface Character {
  id: number;
  name: string;
  level: number;
  vocation?: string;
}

interface User {
  id: number;
  username: string;
}

const AccountPage = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteCharId, setDeleteCharId] = useState<number | null>(null);
  const [deleteCharPw, setDeleteCharPw] = useState("");
  const [deleteCharError, setDeleteCharError] = useState<string | null>(null);

  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deleteAccountPw, setDeleteAccountPw] = useState("");
  const [deleteAccountError, setDeleteAccountError] = useState<string | null>(null);

  const user: User | null = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    axios
      .get(`http://localhost:7172/api/character/${user.id}`)
      .then((res) => setCharacters(res.data.characters))
      .catch((err: unknown) => {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || "Could not fetch characters");
        } else {
          setError("Could not fetch characters");
        }
      })
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handlePlay = (characterId: number, characterName: string) => {
  window.open(`http://localhost:5174/?characterId=${characterId}&characterName=${encodeURIComponent(characterName)}`, "_blank", "noopener");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("characterId");
    navigate("/");
  };

  // === Delete character logic ===
  const openDeleteChar = (charId: number) => {
    setDeleteCharId(charId);
    setDeleteCharPw("");
    setDeleteCharError(null);
  };
  const closeDeleteChar = () => {
    setDeleteCharId(null);
    setDeleteCharPw("");
    setDeleteCharError(null);
  };
  const confirmDeleteChar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await axios.delete(`http://localhost:7172/api/character/${deleteCharId}`, {
        data: { accountId: user.id, password: deleteCharPw },
      });
      setCharacters(chars => chars.filter(c => c.id !== deleteCharId));
      closeDeleteChar();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setDeleteCharError(err.response?.data?.error || "Failed to delete character");
      } else {
        setDeleteCharError("Failed to delete character");
      }
    }
  };

  // === Delete account logic ===
  const openDeleteAccount = () => {
    setShowDeleteAccount(true);
    setDeleteAccountPw("");
    setDeleteAccountError(null);
  };
  const closeDeleteAccount = () => {
    setShowDeleteAccount(false);
    setDeleteAccountPw("");
    setDeleteAccountError(null);
  };
  const confirmDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await axios.delete(`http://localhost:7172/api/account`, {
        data: { accountId: user.id, password: deleteAccountPw },
      });
      localStorage.removeItem("user");
      localStorage.removeItem("characterId");
      navigate("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setDeleteAccountError(err.response?.data?.error || "Failed to delete account");
      } else {
        setDeleteAccountError("Failed to delete account");
      }
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h2>Account Management</h2>
        <div>
          <strong>User:</strong> {user?.username}
        </div>
        <h3>Your characters</h3>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : characters.length === 0 ? (
          <div>No characters yet! Create your first.</div>
        ) : (
          <ul className={styles.characterList}>
            {characters.map((c) => (
              <li key={c.id}>
                <strong>{c.name}</strong> (Lvl {c.level}{c.vocation ? `, ${c.vocation}` : ""}){" "}
                <button onClick={() => handlePlay(c.id, c.name)}>Play as</button>
                <button onClick={() => openDeleteChar(c.id)} className={styles.deleteBtn}>Delete</button>
                {deleteCharId === c.id && (
                  <form className={styles.deleteForm} onSubmit={confirmDeleteChar}>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={deleteCharPw}
                      onChange={e => setDeleteCharPw(e.target.value)}
                      required
                    />
                    <button type="submit">Confirm delete</button>
                    <button type="button" onClick={closeDeleteChar}>Cancel</button>
                    {deleteCharError && <div className={styles.error}>{deleteCharError}</div>}
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
        <button onClick={() => navigate("/create-character")}>Create new character</button>
        <button onClick={handleLogout}>Log out</button>
        <button className={styles.deleteAccountBtn} onClick={openDeleteAccount}>Delete account</button>
        {showDeleteAccount && (
          <form className={styles.deleteForm} onSubmit={confirmDeleteAccount}>
            <input
              type="password"
              placeholder="Enter your password"
              value={deleteAccountPw}
              onChange={e => setDeleteAccountPw(e.target.value)}
              required
            />
            <button type="submit">Confirm account delete</button>
            <button type="button" onClick={closeDeleteAccount}>Cancel</button>
            {deleteAccountError && <div className={styles.error}>{deleteAccountError}</div>}
          </form>
        )}
      </div>
    </Layout>
  );
};

export default AccountPage;

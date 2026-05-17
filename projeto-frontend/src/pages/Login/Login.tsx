import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, loginUser } from "@db/database";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Login.module.css";

type Mode = "login" | "register" | "reset";

export default function Login() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"cliente" | "prestador">("cliente");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const user = await loginUser(email, password);
      if (!user) {
        setError("Email ou senha inválidos");
        return;
      }
      login(user);
      navigate("/hub");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao conectar ao banco de dados",
      );
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Senhas não conferem");
      return;
    }
    try {
      const result = await createUser(name, email, password, role);
      if (result.error) {
        console.log(result.errors);
        alert(result.error);
        return;
      }

      if (!result.data) {
        setError("Não foi possível cadastrar o usuário.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(result.data));
      login(result.data);
      navigate("/hub");
    } catch {
      setError("Erro ao cadastrar. Tente novamente.");
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      "Se houver uma conta com este email, você receberá um link para redefinir sua senha.",
    );
    setMode("login");
  };

  return (
    <div className={styles.page}>
      <div className={`${styles.bgCircle} ${styles.bgCircle1}`} />
      <div className={`${styles.bgCircle} ${styles.bgCircle2}`} />
      <div className={styles.card}>
        {error && <p className={styles.error}>{error}</p>}

        {mode === "login" && (
          <form className={styles.form} onSubmit={handleLogin}>
            <h1 className={styles.title}>Bem-vindo</h1>
            <input
              className={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className={styles.input}
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className={styles.btn} type="submit">
              Entrar
            </button>
            <div className={styles.linkRow}>
              <button
                type="button"
                className={styles.linkBtn}
                onClick={() => setMode("reset")}
              >
                Esqueceu a senha?
              </button>
              <button
                type="button"
                className={styles.linkBtn}
                onClick={() => setMode("register")}
              >
                Cadastre-se
              </button>
            </div>
          </form>
        )}

        {mode === "register" && (
          <form className={styles.form} onSubmit={handleRegister}>
            <h1 className={styles.title}>Criar Conta</h1>
            <input
              className={styles.input}
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className={styles.input}
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className={styles.input}
              type="password"
              placeholder="Confirmar Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className={styles.roleRow}>
              <label className={styles.roleLabel}>
                <input
                  type="radio"
                  name="role"
                  checked={role === "cliente"}
                  onChange={() => setRole("cliente")}
                />
                Cliente
              </label>
              <label className={styles.roleLabel}>
                <input
                  type="radio"
                  name="role"
                  checked={role === "prestador"}
                  onChange={() => setRole("prestador")}
                />
                Prestador
              </label>
            </div>
            <button className={styles.btn} type="submit">
              Cadastrar
            </button>
            <div className={styles.linkRow}>
              <button
                type="button"
                className={styles.linkBtn}
                onClick={() => setMode("login")}
              >
                Já tem conta? Faça login
              </button>
            </div>
          </form>
        )}

        {mode === "reset" && (
          <form className={styles.form} onSubmit={handleReset}>
            <h1 className={styles.title}>Redefinir Senha</h1>
            <p className={styles.hint}>
              Digite seu email para receber um link de redefinição.
            </p>
            <input
              className={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className={styles.btn} type="submit">
              Enviar Link
            </button>
            <div className={styles.linkRow}>
              <button
                type="button"
                className={styles.linkBtn}
                onClick={() => setMode("login")}
              >
                Voltar ao login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

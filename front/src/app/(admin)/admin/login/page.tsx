"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


export default function AdminLoginPage() {
  const router = useRouter();
  const [user_id, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 이미 로그인된 사용자는 /admin으로 리다이렉트
  useEffect(() => {
    axios.get(`/api/auth/me`, { withCredentials: true })
      .then(() => {
        router.push("/admin");
      })
      .catch((error) => {
        // 401이면 아무 동작 안 함 (비로그인 상태)
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `/api/auth/login`,
        { user_id, password },
        { withCredentials: true }
      );
      // 로그인 성공 시 /admin으로 이동
      router.push("/admin");
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("서버 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: 32, border: "1px solid #eee", borderRadius: 8, background: "#fff" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>관리자 로그인</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="user_id">아이디</label>
          <input
            id="user_id"
            type="text"
            value={user_id}
            onChange={e => setUserId(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            autoFocus
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}
        <button type="submit" style={{ width: "100%", padding: 10 }} disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
} 
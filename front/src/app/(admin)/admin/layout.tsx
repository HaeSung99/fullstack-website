"use client";
import '../../globals.css'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    axios.get(`/api/auth/me`, { withCredentials: true })
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`/api/auth/logout`, {}, { withCredentials: true });
      setIsLoggedIn(false);
      router.push('/admin/login');
    } catch (error) {
      alert('로그아웃에 실패했습니다.');
    }
  };

  return (
    <html>
      <body>
        {isLoggedIn && (
          <div style={{ position: 'fixed', top: 24, right: 32, zIndex: 1000 }}>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 20px',
                background: '#222',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              로그아웃
            </button>
          </div>
        )}
        <div>
          {children}
        </div>
      </body>
    </html>
  );
}
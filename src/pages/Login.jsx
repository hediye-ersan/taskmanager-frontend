import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); // Token'ı sakla
        alert('Giriş başarılı!');
        history.push('/dashboard'); // Dashboard'a yönlendir
      } else {
        alert(data.message || 'Giriş başarısız!');
      }
    } catch (err) {
      console.error(err);
      alert('Sunucuya bağlanılamadı.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-lg w-80"
      >
        <h2 className="text-2xl mb-4 font-bold text-center">Giriş Yap</h2>
        <input
          type="text"
          placeholder="Kullanıcı adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default Login;

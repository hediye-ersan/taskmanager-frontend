import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // Yeni email state'i
  const history = useHistory();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }), // Email'i ekledik
      });

      const data = await response.json();

      if (response.ok) {
        alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        history.push('/login');
      } else {
        alert(data.message || 'Kayıt başarısız!');
      }
    } catch (err) {
      console.error(err);
      alert('Sunucuya bağlanılamadı.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded-lg shadow-lg w-80"
      >
        <h2 className="text-2xl mb-4 font-bold text-center">Kayıt Ol</h2>
        <input
          type="text"
          placeholder="Kullanıcı adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Email input'u
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
          Kayıt Ol
        </button>
      </form>
    </div>
  );
};

export default Register;
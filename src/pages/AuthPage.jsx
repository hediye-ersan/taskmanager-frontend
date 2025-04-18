import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthPage = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false); // Login/Register durumu
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // Sadece Register için gerekli
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isRegister
      ? 'http://localhost:8080/api/auth/register'
      : 'http://localhost:8080/api/auth/login';

    const body = isRegister
      ? { username, password, email }
      : { username, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegister) {
          // Kayıt başarılı
          toast.success("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
          setIsRegister(false); // Kayıt sonrası Login'e geçiş
        } else {
          // Giriş başarılı
          localStorage.setItem("token", data.token); // Token'ı sakla
          localStorage.setItem("username", username); // Kullanıcı adını sakla
          toast.success("Giriş başarılı!");
          onLogin(); // Kullanıcı giriş yaptı olarak işaretlenir
          history.push("/dashboard"); // Dashboard'a yönlendir
        }
      } else {
        // Hatalı işlem
        toast.error(data.message || (isRegister ? 'Kayıt başarısız!' : 'Giriş başarısız!'));
      }
    } catch (err) {
      console.error(err);
      toast.error('Sunucuya bağlanılamadı.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-80"
      >
        <h2 className="text-2xl mb-4 font-bold text-center">
          {isRegister ? 'Kayıt Ol' : 'Giriş Yap'}
        </h2>
        <input
          type="text"
          placeholder="Kullanıcı adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        {isRegister && (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
            required
          />
        )}
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
          {isRegister ? 'Kayıt Ol' : 'Giriş Yap'}
        </button>
        <p className="text-sm text-center mt-4">
          {isRegister ? (
            <>
              Zaten üye misiniz?{' '}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => setIsRegister(false)}
              >
                Giriş Yap
              </span>
            </>
          ) : (
            <>
              Üye değil misiniz?{' '}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => setIsRegister(true)}
              >
                Kayıt Ol
              </span>
            </>
          )}
        </p>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AuthPage;
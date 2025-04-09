import React, { useState } from 'react';
import { auth } from '../firebase'; // Firebase projenizden gelen auth nesnesini alın
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import '../styles/pages/Auth.css';

const GirisCorporate = () => {
  const [authData, setAuthData] = useState({ email: '', password: '' });



  const handleChange = (e) => {
    setAuthData({
      ...authData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Firebase signInWithEmailAndPassword fonksiyonu kullanarak giriş yap
      await signInWithEmailAndPassword(auth, authData.email, authData.password);
      toast.success('Başarıyla giriş yapıldı.');
      window.location.href = '/homecorporate';
    } catch (error) {
      // Hata durumunda hata mesajını göster
      console.error('Giriş yapılamadı:', error);
      toast.error('Giriş yapılamadı: ' + error.message);
    }
  };

 

  return (
    <div className='auth'>
      <div className='auth-container'>
      <h2 className='sıfırıncı'>"Yerini AL"</h2>
        <h2 className='birinci'>Kurumsal Kullanıcı</h2>
        <h2 className='ikinci'>Giriş Yap</h2>
<form onSubmit={handleLogin}>
          <label>
            Email:
            <input name='email' value={authData.email} onChange={handleChange} type="email" placeholder='Email' />
          </label>
          <p></p>
          <label>
            Şifre:
            <input name='password' value={authData.password} onChange={handleChange} type="password" placeholder='Password' />
          </label>
          <div className='auth-container-google'>Google ile Giriş Yap</div>
          <button type="submit" className='auth-container-button'>Giriş Yap</button>
        </form>
        <p>Hesabınız yok mu? <a href="/kayitcorporate">  KAYIT OL </a></p>
      </div>
    </div>
  );
};

export default GirisCorporate;

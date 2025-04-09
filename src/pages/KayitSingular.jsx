import React, { useState } from 'react';
import { auth, db, storage } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../styles/pages/Auth.css';

const KayitSingular = () => {
  const [authData, setAuthData] = useState({ email: '', password: '', name: '', telno: '' });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setAuthData({
      ...authData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Firebase Authentication kullanıcı oluştur
      const userCredential = await createUserWithEmailAndPassword(auth, authData.email, authData.password);
      const user = userCredential.user;

      // Firebase Authentication kullanıcı profilini güncelle
      await updateProfile(user, {
        displayName: authData.name, // Kullanıcı adını güncelle
        phoneNumber: authData.telno // Telefon numarasını güncelle
      });

      let imageUrl = null;
      if (image) {
        // Firebase Storage'a profil resmini yükle
        const storageRef = ref(storage, `profile_images/${user.uid}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Firestore'a kullanıcı bilgilerini kaydet
      await setDoc(doc(db, 'Singular Users', user.uid), {
        uid: user.uid,
        email: authData.email,
        name: authData.name,
        telno: authData.telno,
        password: authData.password,
        imageUrl: imageUrl
      });
      
      toast.success('Kullanıcı başarıyla oluşturuldu');
      window.location.href = '/girissingular';
    } catch (error) {
      console.error('Kullanıcı oluşturulamadı:', error);
      toast.error('Kullanıcı oluşturulamadı: ' + error.message);
    }
  };

  return (
    <div className='auth'>
      <div className='auth-container'>
        <h2 className='sıfırıncı'>"Yerini AL"</h2>
        <h2 className='birinci'>Bireysel Kullanıcı</h2>
        <h2 className='ikinci'>Kayıt Ol</h2>
      
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input name='email' value={authData.email} onChange={handleChange} type="email" placeholder='Email' />
          </label>
          <p></p>
          <label>
            Şifre:
            <input name='password' value={authData.password} onChange={handleChange} type="password" placeholder='Password' />
          </label>
          <p></p>
          <label>
            İsim:
            <input name='name' value={authData.name} onChange={handleChange} type="text" placeholder='İsim' />
          </label>
          <p></p>
          <label>
            Telefon Numarası:
            <input name='telno' value={authData.telno} onChange={handleChange} type="tel" placeholder='Telefon Numarası' />
          </label>
          <p></p>
          <label>
            Profil Resmi Yükle:
            <input type="file" onChange={handleImageChange} accept="image/*" />
          </label>
          <button type="submit" className='auth-container-button'>Kaydet</button>
        </form>
      </div>
    </div>
  );
};

export default KayitSingular;

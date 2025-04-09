import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Modal from 'react-modal';
import '../styles/pages/ProfilDuzenleCorporate.css';

const ProfilDuzenleSingular = ({ closeModal }) => { // closeModal prop'unu al

  const [userData, setUserData] = useState({ name: '', telno: '', imageUrl: '' });
  const [image, setImage] = useState(null);

  useEffect(() => {
    // Kullanıcının verilerini al ve state'e yerleştir
    const currentUser = auth.currentUser;
    if (currentUser) {
      const { displayName, phoneNumber, photoURL } = currentUser;
      setUserData({
        name: displayName || '',
        telno: phoneNumber || '',
        imageUrl: photoURL || ''
      });
    }
  }, []);

  const handleChange = (e) => {
    setUserData({
      ...userData,
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
  
    // Form alanlarının boş olup olmadığını kontrol et
    if (!userData.name.trim() || !userData.telno.trim()) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }
  
    try {
      const currentUser = auth.currentUser;
  
      // Kullanıcı bilgilerini güncelle
      await updateProfile(currentUser, {
        displayName: userData.name,
        phoneNumber: userData.telno
      });
  
      let imageUrl = userData.imageUrl;
      if (image) {
        const storageRef = ref(storage, `profile_images/${currentUser.uid}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }
  
      // Firestore'da kullanıcı belgesini güncelle
      await updateDoc(doc(db, 'Singular Users', currentUser.uid), {
        name: userData.name,
        telno: userData.telno,
        imageUrl: imageUrl
      });
  
      toast.success('Profil başarıyla güncellendi');
      closeModal();
  
    } catch (error) {
      console.error('Profil güncellenirken bir hata oluştu:', error);
      toast.error('Profil güncellenirken bir hata oluştu: ' + error.message);
    }
  };
  

  return (
    <Modal
      isOpen={true}
      onRequestClose={closeModal}
      contentLabel="Profil Düzenle Modal"
      style={{
        content: {
          width: '550px', // Modalın genişliğini ayarla
          height: '550px', // Modalın yüksekliğini ayarla
          margin: 'auto' // Modalı dikey ve yatay ortala
        }
      }}
    >
      <div className='modal-header'>
        <button className='modal-close-button' onClick={closeModal}>X</button>
      </div>
      <div className='auth'>
        <div className='auth-container'>
          <h2 className='birinci'>Bireyel Kullanıcı</h2>
          <h2 className='ikinci'>Profil Düzenle</h2>
          <form onSubmit={handleSubmit}>
            <label>
              İsim:
              <input name='name' value={userData.name} onChange={handleChange} type="text" placeholder='İsim' />
            </label>
            <p></p>
            <label>
              Telefon Numarası:
              <input name='telno' value={userData.telno} onChange={handleChange} type="tel" placeholder='Telefon Numarası' />
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
    </Modal>
  );
  
  
};

export default ProfilDuzenleSingular;







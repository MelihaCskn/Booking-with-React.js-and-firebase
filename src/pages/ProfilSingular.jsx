import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import NavbarHomeSingular from "../components/NavbarHomeSingular";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "../styles/pages/ProfilCorporate.css";
import { faUser, faEnvelope, faPhoneAlt } from '@fortawesome/free-solid-svg-icons'; // İkonları import edin
import ProfilDuzenleSingular from './ProfilDuzenleSingular';// ProfilDuzenleCorporate bileşenini import edin

const ProfilSingular = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null); // Profil resmi için state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modalın açık veya kapalı olduğunu izleyen state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await loadUserData(user.uid);
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserData = async (uid) => {
    try {
      const userDoc = doc(db, 'Singular Users', uid);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserData(userData);

        // Profil resmi URL'sini al
        const profileImageUrl = userData.imageUrl;
        setProfileImage(profileImageUrl);
      } else {
        console.log('Belge bulunamadı!');
      }
    } catch (error) {
      console.error('Kullanıcı verileri yüklenirken bir hata oluştu:', error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!user) {
    return (
      <div>
        <NavbarHomeSingular />
        <p>Lütfen giriş yapın.</p>
      </div>
    );
  }

  if (userData) {
    return (
      <div className='profil'>
        <NavbarHomeSingular />
        <p className='baslik'>Kurumsal Kullanıcı Bilgileri</p>
        <div className="profil-content">
          <div className="profil-image">
            {profileImage && (
              <img 
                src={profileImage} 
                alt="Profil Resmi" 
                style={{ maxWidth: '400px', maxHeight: '400px' }} // Resmin maksimum genişlik ve yüksekliğini ayarlayın
              />
            )}
          </div>
          <div className="profil-info">
            <FontAwesomeIcon icon={faUser} className='insanicon' />
            <div className="user-info">
              <FontAwesomeIcon icon={faUser} className='icon' />
              <p className="yazi-tipli-element">İsim: {userData.name}</p>
            </div>
            <div className="user-info">
              <FontAwesomeIcon icon={faEnvelope} className='icon' />
              <p className='yazi-tipli-element'>Email: {user.email}</p>
            </div>
            <div className="user-info">
              <FontAwesomeIcon icon={faPhoneAlt} className='icon' />
              <p className='yazi-tipli-element'>Telefon Numarası: {userData.telno}</p>
            </div>
            <button className='butonn' onClick={openModal}>Profil Düzenle</button>
          </div>
        </div>
        {/* ProfilDuzenleCorporate bileşenini modal olarak aç */}
        {isModalOpen && (
          <ProfilDuzenleSingular closeModal={closeModal} />
        )}
      </div>
    );
  }

  return (
    <div>
      <NavbarHomeSingular />
      <p>Profil bilgileri yükleniyor...</p>
    </div>
  );
};

export default ProfilSingular;

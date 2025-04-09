import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import NavbarHomeCorporate from "../components/NavbarHomeCorporate";
import KampanyaEkle from "../pages/KampanyaEkle";
import "../styles/pages/MekanlarimCorporate.css";

const MekanlarimCorporate = () => {
  const [cafes, setCafes] = useState([]);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCafe, setSelectedCafe] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const getCafes = async () => {
      if (currentUser) {
        const cafesCollectionRef = collection(db, 'Kafe Bilgileri');
        const q = query(cafesCollectionRef, where("uid", "==", currentUser.uid));
        const snapshot = await getDocs(q);
        const cafesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCafes(cafesData);
      }
    };

    getCafes();
  }, [currentUser]);

  const goToMekanEkle = () => {
    window.location.href = "/mekaneklecorporate";
  };

  const goToMekanGuncelle = (id) => {
    window.location.href = `/mekanguncelle/${id}`;
  };

  const deleteCafe = async (id) => {
    const confirmed = window.confirm("Bu mekanı silmek istediğinize emin misiniz?");
    if (confirmed) {
      await deleteDoc(doc(db, 'Kafe Bilgileri', id));
      setCafes(cafes.filter(cafe => cafe.id !== id));
    }
  };

  const openModal = (cafe) => {
    setSelectedCafe(cafe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCafe(null);
    setIsModalOpen(false);
  };

  const formatDate = (date) => {
    const d = new Date(date.seconds * 1000);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  };

  const getRandomColor = () => {
    const colors = ['#ADD8E6'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="cafe-list-container">
      <NavbarHomeCorporate />
      <div className="header-container">
        <h2 className='baslik'>Mekanlarım</h2>
        <button onClick={goToMekanEkle} className="mekan-ekle-button">Mekan Ekle</button>
      </div>
      <div className="cafe-list">
        <div className="cafe-grid">
          {cafes.map(cafe => (
            <div key={cafe.id} className="cafe-card" style={{ backgroundColor: getRandomColor() }}>
              <h3>{cafe.kafeIsim}</h3>
              <p>Adres: {cafe.adres}</p>
              <p>İl: {cafe.il}</p>
              <p>İlçe: {cafe.ilce}</p>
              <p>İki Kişilik Masa Sayısı: {cafe.ikikisilikmasasayisi}</p>
              <p>İki Kişilik Masa Fiyatı: {cafe.ikikisilikmasafiyati}</p>
              <p>Dört Kişilik Masa Sayısı: {cafe.dortkisilikmasasayisi}</p>
              <p>Dört Kişilik Masa Fiyatı: {cafe.dortkisilikmasafiyati}</p>
              <p>Alti Kişilik Masa Sayısı: {cafe.altikisilikmasasayisi}</p>
              <p>Alti Kişilik Masa Fiyatı: {cafe.altikisilikmasafiyati}</p>
              <p>Toplu Masa Sayısı: {cafe.toplumasasayisi}</p>
              <p>Toplu Masa Fiyatı: {cafe.toplumasafiyati}</p>
              <p>Rezervasyon Yapabileceğiniz Tarih Aralığı</p>
              <p>{formatDate(cafe.rezervasyonBaslangic)} - {formatDate(cafe.rezervasyonBitis)}</p>
              {cafe.imageUrl && <img src={cafe.imageUrl} alt="Kafe Resmi" className="mekan-image" />}
              <button onClick={() => openModal(cafe)}>Kampanya Düzenle</button>
              <button onClick={() => goToMekanGuncelle(cafe.id)}>Mekan Güncelle</button>
              <button onClick={() => deleteCafe(cafe.id)}>Mekan Sil</button>
            </div>
          ))}
        </div>
      </div>
      {selectedCafe && <KampanyaEkle cafe={selectedCafe} isOpen={isModalOpen} onClose={closeModal} />}
    </div>
  );
};

export default MekanlarimCorporate;

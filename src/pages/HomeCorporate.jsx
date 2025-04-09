import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Firebase module import
import { collection, getDocs } from "firebase/firestore";
import "../styles/pages/AnasayfaCorporate.css"
import NavbarHomeCorporate from "../components/NavbarHomeCorporate";

const CafeListCorporate = () => {
  const [cafes, setCafes] = useState([]);

  useEffect(() => {
    const getCafes = async () => {
      const cafesCollectionRef = collection(db, 'Kafe Bilgileri');
      const snapshot = await getDocs(cafesCollectionRef);
      const cafesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCafes(cafesData);
    };

    getCafes();
  }, []);

  // Function to format dates
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date.seconds * 1000);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  // Function to get random background colors
  const getRandomColor = () => {
    const colors = ['#ADD8E6'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="cafe-list-container">
      <NavbarHomeCorporate />
      <h2 className='baslik'>Kafeler/Restoranlar</h2>
      <div className="cafe-list">
        <div className="cafe-grid">
          {cafes.map(cafe => (
            <div key={cafe.id} className="cafe-card" style={{ backgroundColor: getRandomColor(), maxWidth: '100%' }}>
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
              <p>Rezervasyon Yapabileceğiniz Tarih Aralığı  </p>
              <p>{formatDate(cafe.rezervasyonBaslangic)} - {formatDate(cafe.rezervasyonBitis)}</p>
              {cafe.imageUrl && <img src={cafe.imageUrl} alt="Kafe Resmi" style={{ width: '200px', height: '200px' }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CafeListCorporate;

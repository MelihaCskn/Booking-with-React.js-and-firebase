import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from "firebase/firestore";
import "../styles/pages/AnasayfaCorporate.css";
import NavbarHomeSingular from "../components/NavbarHomeSingular";
import RezerveYap from './RezerveYap';

const CafeListCorporate = () => {
  const [cafes, setCafes] = useState([]);
  const [filterCity, setFilterCity] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [selectedCafe, setSelectedCafe] = useState(null);

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

  const getRandomColor = () => {
    const colors = ['#ADD8E6'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleCafeClick = (cafe) => {
    setSelectedCafe(cafe);
  };

  const filteredCafes = cafes.filter(cafe => {
    if (!filterCity && !filterDistrict) {
      return true;
    }
    if (filterCity && cafe.il.toLowerCase().includes(filterCity.toLowerCase())) {
      if (filterDistrict && cafe.ilce.toLowerCase().includes(filterDistrict.toLowerCase())) {
        return true;
      } else if (!filterDistrict) {
        return true;
      }
    }
    return false;
  });

  return (
    <div className="cafe-list-container">
      <NavbarHomeSingular />
      <div className="center-content">
        <h2 className='baslik'>Kafeler/Restoranlar</h2>
        <div className="filter-section">
          <div className="filter-input">
            <input
              type="text"
              placeholder="İl"
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
            />
          </div>
          <div className="filter-input">
            <input
              type="text"
              placeholder="İlçe"
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
            />
          </div>
        </div>
        <div className="cafe-list">
          <div className="cafe-grid">
            {filteredCafes.map(cafe => (
              <div key={cafe.id} className="cafe-card" style={{ backgroundColor: getRandomColor(), maxWidth: '100%' }} onClick={() => handleCafeClick(cafe)}>
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
                {cafe.imageUrl && <img src={cafe.imageUrl} alt="Kafe Resmi" style={{ width: '200px', height: '200px' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedCafe && (
        <RezerveYap cafe={selectedCafe} onClose={() => setSelectedCafe(null)} />
      )}
    </div>
  );
};

export default CafeListCorporate;


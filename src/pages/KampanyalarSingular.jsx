import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from "firebase/firestore";
import "../styles/pages/KampanyalarSingular.css";
import NavbarHomeSingular from "../components/NavbarHomeSingular";
import KampanyaRezerveSingular from './KampanyaRezerveSingular';

const KampanyalarSingular = () => {
  const [cafes, setCafes] = useState([]);
  const [filterCity, setFilterCity] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [selectedCafe, setSelectedCafe] = useState(null);

  useEffect(() => {
    const getCafes = async () => {
      const cafesCollectionRef = collection(db, 'Kampanyalar');
      const snapshot = await getDocs(cafesCollectionRef);
      const cafesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCafes(cafesData);
    };

    getCafes();
  }, []);

  // Tarih formatlama fonksiyonu
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date.seconds * 1000);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
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
        <h1 className='baslik'>Kampanyalı Kafeler/Restoranlar</h1>

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
              <div key={cafe.id} className="cafe-card">
                <h3>{cafe.kafeIsim}</h3>
                <p>Adres: {cafe.adres}</p>
                <p>İl: {cafe.il}</p>
                <p>İlçe: {cafe.ilce}</p>

                <div className="price-section">
                  <div className="price-row">
                    <p className="price-label">İki Kişilik Fiyat:</p>
                    <p className="price">{cafe.ikikisilikmasafiyati}</p>
                    <p className="campaign-price-label">Kampanyalı Fiyat:</p>
                    <p className="campaign-price">{cafe.kampanyaFiyatiki}</p>
                  </div>
                  <p>İki Kişilik Masa Sayısı: {cafe.ikikisilikmasasayisi}</p>

                  <div className="price-row">
                    <p className="price-label">Dört Kişilik Fiyat:</p>
                    <p className="price">{cafe.dortkisilikmasafiyati}</p>
                    <p className="campaign-price-label">Kampanyalı Fiyat:</p>
                    <p className="campaign-price">{cafe.kampanyaFiyatdort}</p>
                  </div>
                  <p>Dört Kişilik Masa Sayısı: {cafe.dortkisilikmasasayisi}</p>

                  <div className="price-row">
                    <p className="price-label">Altı Kişilik Fiyat:</p>
                    <p className="price">{cafe.altikisilikmasafiyati}</p>
                    <p className="campaign-price-label">Kampanyalı Fiyat:</p>
                    <p className="campaign-price">{cafe.kampanyaFiyatalti}</p>
                  </div>
                  <p>Altı Kişilik Masa Sayısı: {cafe.altikisilikmasasayisi}</p>

                  <div className="price-row">
                    <p className="price-label">Toplu Masa Fiyat:</p>
                    <p className="price">{cafe.toplumasafiyati}</p>
                    <p className="campaign-price-label">Kampanyalı Fiyat:</p>
                    <p className="campaign-price">{cafe.kampanyaFiyattoplu}</p>
                  </div>
                  <p>Toplu Masa Sayısı: {cafe.toplumasasayisi}</p>

                  <p>Rezervasyon Yapabileceğiniz Tarih Aralığı</p>
                  <p>{formatDate(cafe.kampanyaTarih1)} - {formatDate(cafe.kampanyaTarih2)}</p>
                  {cafe.imageUrl && <img src={cafe.imageUrl} alt="Kafe Resmi" />}
                </div>

                <button onClick={() => handleCafeClick(cafe)}>Rezervasyon Yap</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedCafe && (
        <KampanyaRezerveSingular cafe={selectedCafe} onClose={() => setSelectedCafe(null)} />
      )}
    </div>
  );
};

export default KampanyalarSingular;

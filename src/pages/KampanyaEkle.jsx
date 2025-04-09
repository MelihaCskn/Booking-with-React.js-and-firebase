import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "../styles/pages/KampanyaEkle.css";

const KampanyaEkle = ({ cafe, isOpen, onClose }) => {
  const [newPrices, setNewPrices] = useState({
    ikiKisilikMasaFiyati: '',
    dortKisilikMasaFiyati: '',
    altiKisilikMasaFiyati: '',
    topluMasaFiyati: ''
  });

  const [campaignDates, setCampaignDates] = useState({
    startDate: new Date(),
    endDate: new Date()
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const kampanyaDocRef = await addDoc(collection(db, 'Kampanyalar'), {
        kafeId: cafe.id,
        kafeIsim: cafe.kafeIsim,
        il: cafe.il,
        ilce: cafe.ilce,
        adres: cafe.adres,
        ikikisilikmasafiyati: cafe.ikikisilikmasafiyati,
        dortkisilikmasafiyati: cafe.dortkisilikmasafiyati,
        altikisilikmasafiyati: cafe.altikisilikmasafiyati,
        toplumasafiyati: cafe.toplumasafiyati,
        ikikisilikmasasayisi: cafe.ikikisilikmasasayisi,
        dortkisilikmasasayisi: cafe.dortkisilikmasasayisi,
        altikisilikmasasayisi: cafe.altikisilikmasasayisi,
        toplumasasayisi: cafe.toplumasasayisi,
        kampanyaFiyatiki: newPrices.ikiKisilikMasaFiyati,
        kampanyaFiyatdort: newPrices.dortKisilikMasaFiyati,
        kampanyaFiyatalti: newPrices.altiKisilikMasaFiyati,
        kampanyaFiyattoplu: newPrices.topluMasaFiyati,
        kampanyaTarih1: campaignDates.startDate,
        kampanyaTarih2: campaignDates.endDate,
        imageUrl: cafe.imageUrl || ''
      });

      alert('Kampanya başarıyla eklendi!');
      navigate('/kampanyalarCorporate');
    } catch (error) {
      console.error('Firestore ekleme hatası:', error);
      alert('İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleChange = (e, setState) => {
    setState(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return isOpen ? (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Kampanya Düzenle - {cafe.kafeIsim}</h2>
        <form onSubmit={handleSubmit} className="campaign-form">
          <h3>Eski Fiyatlar</h3>
          <div className="price-info">
            <p>İki Kişilik Masa Fiyatı: {cafe.ikikisilikmasafiyati}</p>
            <p>Dört Kişilik Masa Fiyatı: {cafe.dortkisilikmasafiyati}</p>
            <p>Altı Kişilik Masa Fiyatı: {cafe.altikisilikmasafiyati}</p>
            <p>Toplu Masa Fiyatı: {cafe.toplumasafiyati}</p>
          </div>

          <h3>Yeni Kampanyalı Fiyatlar</h3>
          <div className="input-group">
            <label>
              İki Kişilik Masa Fiyatı:
              <input type="number" name="ikiKisilikMasaFiyati" value={newPrices.ikiKisilikMasaFiyati} onChange={(e) => handleChange(e, setNewPrices)} />
            </label>
            <label>
              Dört Kişilik Masa Fiyatı:
              <input type="number" name="dortKisilikMasaFiyati" value={newPrices.dortKisilikMasaFiyati} onChange={(e) => handleChange(e, setNewPrices)} />
            </label>
            <label>
              Altı Kişilik Masa Fiyatı:
              <input type="number" name="altiKisilikMasaFiyati" value={newPrices.altiKisilikMasaFiyati} onChange={(e) => handleChange(e, setNewPrices)} />
            </label>
            <label>
              Toplu Masa Fiyatı:
              <input type="number" name="topluMasaFiyati" value={newPrices.topluMasaFiyati} onChange={(e) => handleChange(e, setNewPrices)} />
            </label>
          </div>

          <h3>Kampanya Tarihleri</h3>
          <div className="input-group">
            <label>
              Başlangıç Tarihi:
              <DatePicker
                selected={campaignDates.startDate}
                onChange={(date) => setCampaignDates(prevDates => ({ ...prevDates, startDate: date }))}
                dateFormat="yyyy-MM-dd"
                minDate={new Date(cafe.rezervasyonBaslangic.seconds * 1000)}
                maxDate={new Date(cafe.rezervasyonBitis.seconds * 1000)}
              />
            </label>
            <label>
              Bitiş Tarihi:
              <DatePicker
                selected={campaignDates.endDate}
                onChange={(date) => setCampaignDates(prevDates => ({ ...prevDates, endDate: date }))}
                dateFormat="yyyy-MM-dd"
                minDate={new Date(cafe.rezervasyonBaslangic.seconds * 1000)}
                maxDate={new Date(cafe.rezervasyonBitis.seconds * 1000)}
              />
            </label>
          </div>

          <button type="submit" className="submit-button">Kampanya Ekle</button>
        </form>
      </div>
    </div>
  ) : null;
};

export default KampanyaEkle;

import React, { useState } from 'react';
import Modal from 'react-modal';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase'; // Firebase konfigürasyonunun doğru şekilde import edildiğinden emin olun
import ikiKisilikResim from './images/iki.jpg';
import dortKisilikResim from './images/dort.jpeg';
import altiKisilikResim from './images/alti.jpg';
import topluMasaResim from './images/toplu.jpg';
import '../styles/pages/RezerveYapİslemler.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const KampanyaİslemlerSingular = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDate, cafe } = location.state || {};

  const [selectedTables, setSelectedTables] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [warning, setWarning] = useState('');

  const customModalStyles = {
    content: {
      width: '700px',
      maxHeight: '90vh',
      margin: 'auto',
      overflow: 'auto',
    },
    overlay: {
      backgroundColor: 'rgba(1, 0, 0, 0.2)',
    },
  };

  // Tarihi formatlamak için yardımcı fonksiyon
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const today = new Date();

  // Masa seçimi işleyici fonksiyonu
  const handleTableSelection = (tableType, price, availableTables) => {
    setWarning('');
    if (selectedDate < today) {
      setWarning('Geçmiş bir tarih seçemezsiniz!');
      return;
    }

    setSelectedTables((prevSelectedTables) => {
      const currentCount = prevSelectedTables[tableType] || 0;
      if (currentCount < availableTables) {
        const newSelectedTables = { ...prevSelectedTables, [tableType]: currentCount + 1 };
        const newTotalPrice = calculateTotalPrice(newSelectedTables);
        setTotalPrice(newTotalPrice);
        return newSelectedTables;
      } else {
        setWarning('Seçilen masa türünden mevcut masa yok!');
        return prevSelectedTables;
      }
    });
  };

  // Masa kaldırma işleyici fonksiyonu
  const handleTableRemoval = (tableType) => {
    setSelectedTables((prevSelectedTables) => {
      const currentCount = prevSelectedTables[tableType];
      if (currentCount > 0) {
        const newSelectedTables = { ...prevSelectedTables, [tableType]: currentCount - 1 };
        if (newSelectedTables[tableType] === 0) {
          delete newSelectedTables[tableType];
        }
        const newTotalPrice = calculateTotalPrice(newSelectedTables);
        setTotalPrice(newTotalPrice);
        return newSelectedTables;
      }
      return prevSelectedTables;
    });
  };

  // Toplam fiyat hesaplama fonksiyonu
  const calculateTotalPrice = (selectedTables) => {
    let totalPrice = 0;
    Object.keys(selectedTables).forEach(tableType => {
      const count = selectedTables[tableType];
      switch (tableType) {
        case 'ikiKisilik':
          totalPrice += count * cafe.kampanyaFiyatiki;
          break;
        case 'dortKisilik':
          totalPrice += count * cafe.kampanyaFiyatdort;
          break;
        case 'altiKisilik':
          totalPrice += count * cafe.kampanyaFiyatalti;
          break;
        case 'toplu':
          totalPrice += count * cafe.kampanyaFiyattoplu;
          break;
        default:
          break;
      }
    });
    return totalPrice;
  };

  // Rezervasyon işleyici fonksiyonu
  const handleReserve = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      setWarning('Lütfen giriş yapın!');
      return;
    }
  
    const userId = user.uid;
    const userName = user.displayName || 'Anonim';
    const userEmail = user.email;
  
    const kafeId = cafe.kafeId;
    const kafeIsim = cafe.kafeIsim;
    const kafeAdres = cafe.adres; // Kafe adresini buradan alın
  
    // Firebase veritabanında rezervasyon bilgilerini güncelle
    const kafeDocRef = doc(db, 'Kafe Bilgileri', kafeId);
  
    const updatedData = {
      ikikisilikmasasayisi: cafe.ikikisilikmasasayisi - (selectedTables.ikiKisilik || 0),
      dortkisilikmasasayisi: cafe.dortkisilikmasasayisi - (selectedTables.dortKisilik || 0),
      altikisilikmasasayisi: cafe.altikisilikmasasayisi - (selectedTables.altiKisilik || 0),
      toplumasasayisi: cafe.toplumasasayisi - (selectedTables.toplu || 0),
    };
  
    await updateDoc(kafeDocRef, updatedData);
  
    const reservationId = uuidv4();
    const reservationDocRef = doc(db, 'Kampanyalı Rezervasyonlar', reservationId);
  
    await setDoc(reservationDocRef, {
      rezervasyonId: reservationId,
      kafeId: kafeId,
      kafeIsim: kafeIsim,
      kafeAdres: kafeAdres, // Kafe adresini rezervasyon belgesine ekleyin
      selectedTables,
      totalPrice,
      selectedDate,
      uid: userId,
      userName,
      userEmail,
    });  
  
    toast.success('Rezervasyon işlemi başarılı!');
  
    setTimeout(() => {
      navigate('/rezervasyonlarim');
    }, 3000);
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={() => navigate('/homesingular')}
      contentLabel="Rezerve Yap İşlemler Modal"
      style={customModalStyles}
    >
      <div className="modal-header">
        <button className="modal-close-button" onClick={() => navigate('/homesingular')}>
          X
        </button>
      </div>
      <div className="rezerve-yap-islemler-details">
        <h2>Masa kişi sayısı-adet bilgisi seçimi</h2>
        <p>Seçilen Tarih: {formatDate(selectedDate)}</p>
        <h3>{cafe.kafeIsim}</h3>
        <p>Adres: {cafe.adres}</p>
        <p>İl: {cafe.il}</p>
        <p>İlçe: {cafe.ilce}</p>
        <div className="table-selection-container">
          <div className="table-selection-item">
            <button onClick={() => handleTableSelection('ikiKisilik', cafe.kampanyaFiyatiki, cafe.ikikisilikmasasayisi)}>
              <img src={ikiKisilikResim} alt="İki Kişilik Masa" className="table-image" />
              İki Kişilik Masa - {cafe.kampanyaFiyatiki} TL (Kampanyalı) <br /> Normal Fiyat: {cafe.ikikisilikmasafiyati} TL
            </button>
            <p>Mevcut Masa Sayısı: {cafe.ikikisilikmasasayisi}</p>
          </div>
          <div className="table-selection-item">
            <button onClick={() => handleTableSelection('dortKisilik', cafe.kampanyaFiyatdort, cafe.dortkisilikmasasayisi)}>
              <img src={dortKisilikResim} alt="Dört Kişilik Masa" className="table-image" />
              Dört Kişilik Masa - {cafe.kampanyaFiyatdort} TL (Kampanyalı) <br /> Normal Fiyat: {cafe.dortkisilikmasafiyati} TL
            </button>
            <p>Mevcut Masa Sayısı: {cafe.dortkisilikmasasayisi}</p>
          </div>
          <div className="table-selection-item">
            <button onClick={() => handleTableSelection('altiKisilik', cafe.kampanyaFiyatalti, cafe.altikisilikmasasayisi)}>
              <img src={altiKisilikResim} alt="Altı Kişilik Masa" className="table-image" />
              Altı Kişilik Masa - {cafe.kampanyaFiyatalti} TL (Kampanyalı) 
              <br />Normal Fiyat: {cafe.altikisilikmasafiyati} TL
            </button>
            <p>Mevcut Masa Sayısı: {cafe.altikisilikmasasayisi}</p>
          </div>
          <div className="table-selection-item">
            <button onClick={() => handleTableSelection('toplu', cafe.kampanyaFiyattoplu, cafe.toplumasasayisi)}>
              <img src={topluMasaResim} alt="Toplu Masa" className="table-image" />
              Toplu Masa - {cafe.kampanyaFiyattoplu} TL (Kampanyalı) <br /> Normal Fiyat: {cafe.toplumasafiyati} TL
            </button>
            <p>Mevcut Masa Sayısı: {cafe.toplumasasayisi}</p>
          </div>
        </div>
        {warning && <p className="warning">{warning}</p>}
        <div className="selected-tables">
          <h3>Seçilen Masa Bilgisi</h3>
          {Object.keys(selectedTables).map((tableType) => (
            <div key={tableType} className="selected-table">
              <p>{tableType}: {selectedTables[tableType]}</p>
              <button className="remove-button" onClick={() => handleTableRemoval(tableType)}>Masa Çıkar</button>
            </div>
          ))}
        </div>
        <div className="total-price">
          <h3>Toplam Tutar: {totalPrice} TL</h3>
        </div>
        <div className="button-container">
          <button className="reserve-button" onClick={handleReserve}>Rezervasyon Yap</button>
        </div>
      </div>
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar closeOnClick pauseOnHover />
    </Modal>
  );
};

export default KampanyaİslemlerSingular;

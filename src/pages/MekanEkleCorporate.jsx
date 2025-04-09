import React, { useState } from 'react';
import { db, auth, storage } from '../firebase';
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { v4 as uuidv4 } from 'uuid'; 
import "../styles/pages/MekanEkleCorporate.css";
import NavbarHomeCorporate from "../components/NavbarHomeCorporate";

const MekanEkleCorporate = () => {
  const [cafeInfo, setCafeInfo] = useState({
    kafeIsim: '',
    adres: '',
    il: '',
    ilce: '',
    altikisilikmasasayisi: 0,
    altikisilikmasafiyati: 0,
    ikikisilikmasasayisi: 0,
    ikikisilikmasafiyati: 0,
    dortkisilikmasasayisi: 0,
    dortkisilikmasafiyati: 0,
    toplumasasayisi: 0,
    toplumasafiyati: 0,
  });
  const [image, setImage] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCafeInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = auth.currentUser.uid;
      let imageUrl = null;
      
     
      if (image) {
        const imageId = uuidv4(); 
        const storageRef = ref(storage, `kafe_images/${userId}/${imageId}`); 
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }
      
   
      const kafeId = uuidv4();
      const kafeDocRef = doc(db, 'Kafe Bilgileri', kafeId);
      await setDoc(kafeDocRef, {
        kafeId: kafeId, 
        kafeIsim: cafeInfo.kafeIsim,
        adres: cafeInfo.adres,
        il: cafeInfo.il,
        ilce: cafeInfo.ilce,
        altikisilikmasasayisi: cafeInfo.altikisilikmasasayisi,
        altikisilikmasafiyati: cafeInfo.altikisilikmasafiyati,
        ikikisilikmasasayisi: cafeInfo.ikikisilikmasasayisi,
        ikikisilikmasafiyati: cafeInfo.ikikisilikmasafiyati,
        dortkisilikmasasayisi: cafeInfo.dortkisilikmasasayisi,
        dortkisilikmasafiyati: cafeInfo.dortkisilikmasafiyati,
        toplumasasayisi: cafeInfo.toplumasasayisi,
        toplumasafiyati: cafeInfo.toplumasafiyati,
        imageUrl: imageUrl,
        uid: userId,
        rezervasyonBaslangic: startDate,
        rezervasyonBitis: endDate
      });

      alert('Kafe ve kullanıcı bilgileri başarıyla eklendi!');
      window.location.href = '/mekanlarimcorporate';

      // Formu sıfırla
      setCafeInfo({
        kafeIsim: '',
        adres: '',
        il: '',
        ilce: '',
        altikisilikmasasayisi: 0,
        altikisilikmasafiyati: 0,
        ikikisilikmasasayisi: 0,
        ikikisilikmasafiyati: 0,
        dortkisilikmasasayisi: 0,
        dortkisilikmasafiyati: 0,
        toplumasasayisi: 0,
        toplumasafiyati: 0,
      });
      setStartDate(new Date());
      setEndDate(new Date());
    } catch (error) {
      console.error('Belge eklenirken hata oluştu: ', error);
      alert('Kafe ve kullanıcı bilgileri eklenirken bir hata oluştu!');
    }
  };

  return (
    <div className='hepsi'>
       <div >
      <NavbarHomeCorporate />
      <div>
      <div className='hepsi-container'>
        <h2 className='baslik'>Kafe Bilgileri Ekle</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Kafe İsmi:
            <input type="text" name="kafeIsim" value={cafeInfo.kafeIsim} onChange={handleChange} required />
          </label>
          <br />
          <label>
            Adres:
            <input type="text" name="adres" value={cafeInfo.adres} onChange={handleChange} required />
          </label>
          <br />
          <label>
            İl:
            <input type="text" name="il" value={cafeInfo.il} onChange={handleChange} required />
          </label>
          <br />
          <label>
            İlçe:
            <input type="text" name="ilce" value={cafeInfo.ilce} onChange={handleChange} required />
          </label>
          <br />
       
          <label>
            İki Kişilik Masa Sayısı:
            <input type="number" name="ikikisilikmasasayisi" value={cafeInfo.ikikisilikmasasayisi} onChange={handleChange} required />
          </label>
          <br />
          <label>
            İki Kişilik Masa Fiyatı:
            <input type="number" name="ikikisilikmasafiyati" value={cafeInfo.ikikisilikmasafiyati} onChange={handleChange} required />
          </label>
          <br />
          <label>
            Dört Kişilik Masa Sayısı:
            <input type="number" name="dortkisilikmasasayisi" value={cafeInfo.dortkisilikmasasayisi} onChange={handleChange} required />
          </label>
          <br />
          <label>
            Dört Kişilik Masa Fiyatı:
            <input type="number" name="dortkisilikmasafiyati" value={cafeInfo.dortkisilikmasafiyati} onChange={handleChange} required />
          </label>
          <br />
          <label>
            Altı Kişilik Masa Sayısı:
            <input type="number" name="altikisilikmasasayisi" value={cafeInfo.altikisilikmasasayisi} onChange={handleChange} required />
          </label>
          <br />
          <label>
            Altı Kişilik Masa Fiyatı:
            <input type="number" name="altikisilikmasafiyati" value={cafeInfo.altikisilikmasafiyati} onChange={handleChange} required />
          </label>
          <br />
          <label>
            Toplu Masa Sayısı:
            <input type="number" name="toplumasasayisi" value={cafeInfo.toplumasasayisi} onChange={handleChange} required />
          </label>
          <br />
          <label>
            Toplu Masa Fiyatı:
            <input type="number" name="toplumasafiyati" value={cafeInfo.toplumasafiyati} onChange={handleChange} required />
          </label>
          <br />
          <label>
            Kafe Resmi Yükle:
            <input type="file" onChange={handleImageChange} accept="image/*" />
          </label>
          <br />
          <label>
            Rezervasyon Başlangıç Tarihi:
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
          </label>
          <br />
          <label>
            Rezervasyon Bitiş Tarihi:
            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
          </label>
          <br />
          <button type="submit" className='butonn'>Bilgileri Gönder</button>
        </form>
      </div>
      </div>
      </div>
    </div>
  );
};

export default MekanEkleCorporate;

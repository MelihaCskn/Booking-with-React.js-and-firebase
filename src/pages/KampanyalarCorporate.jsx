import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import NavbarHomeCorporate from '../components/NavbarHomeCorporate';
import '../styles/pages/RezerveBilgi.css';

const KampanyalarCorporate = () => {
  const [rezervasyonlar, setRezervasyonlar] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchRezervasyonlar = async (userId) => {
      try {
        // Kullanıcının kafelerini sorgula ve al
        const kafelerQuery = query(collection(db, "Kafe Bilgileri"), where("uid", "==", userId));
        const kafelerSnapshot = await getDocs(kafelerQuery);
        const kafeler = kafelerSnapshot.docs.map(doc => doc.id);

        // Tüm rezervasyonları depolamak için boş bir obje oluştur
        const allRezervasyonlar = {};

        // Her kafe için rezervasyonları getir
        for (const kafeId of kafeler) {
          const rezervasyonQuery = query(collection(db, "Kampanyalı Rezervasyonlar"), where("kafeId", "==", kafeId));
          const rezervasyonSnapshot = await getDocs(rezervasyonQuery);
          const rezervasyonlarForKafe = rezervasyonSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          // Rezervasyonları tarihine göre sırala
          rezervasyonlarForKafe.sort((a, b) => {
            const dateA = a.selectedDate.seconds * 1000;
            const dateB = b.selectedDate.seconds * 1000;
            return dateA - dateB;
          });

          // Her kafe için rezervasyonları ilgili kafe ID'si altında sakla
          allRezervasyonlar[kafeId] = rezervasyonlarForKafe;
        }

        // Rezervasyonları state'e kaydet ve yükleme durumunu false yap
        setRezervasyonlar(allRezervasyonlar);
        setLoading(false);
      } catch (error) {
        console.error("Rezervasyonları getirirken hata oluştu:", error);
        setLoading(false);
      }
    };

    // Kullanıcı oturum durumunu takip et
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchRezervasyonlar(user.uid);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // Aboneliği temizle
    return () => unsubscribe();
  }, []);

  // Timestamp'i tarih formatına çevirme fonksiyonu
  const formatTimestamp = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
    return 'Bilinmiyor';
  };

  // Yükleme durumunda
  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  // Kullanıcı yoksa
  if (!user) {
    return <div className="not-authenticated">Lütfen giriş yapın.</div>;
  }

  // Rezervasyonlar mevcutsa
  return (
    <div className="rezerve-bilgi">
      <NavbarHomeCorporate />
      <h1>Kampanyalı Rezervasyon Bilgileri</h1>
      {Object.keys(rezervasyonlar).length === 0 ? (
        <p>Hiç rezervasyon bulunmamaktadır.</p>
      ) : (
        <div className="kafe-listesi">
          {Object.keys(rezervasyonlar).map(kafeId => (
            <div key={kafeId} className="kafe-card">
              <h2>Kafe: {rezervasyonlar[kafeId].length > 0 ? rezervasyonlar[kafeId][0].kafeIsim : 'Bilinmiyor'}</h2>
              {rezervasyonlar[kafeId].length === 0 ? (
                <p className="no-reservation">Bu kafeye ait rezervasyon bulunmamaktadır.</p>
              ) : (
                <ul>
                  {rezervasyonlar[kafeId].map((rezervasyon) => (
                    <li key={rezervasyon.id} className="rezervasyon-item">
                      <h3>Rezervasyon Tarihi: {formatTimestamp(rezervasyon.selectedDate)}</h3>
                      <h4>Seçilen Masalar:</h4>
                      <ul>
                        {Object.keys(rezervasyon.selectedTables).map(tableType => (
                          <li key={tableType}>
                            {tableType}: {rezervasyon.selectedTables[tableType]} adet
                          </li>
                        ))}
                      </ul>
                      <p>Toplam Fiyat: {rezervasyon.totalPrice}</p>
                      <p>Rezervasyonu Yapan: {rezervasyon.userName} ({rezervasyon.userEmail})</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KampanyalarCorporate;

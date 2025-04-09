import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase'; 
import '../styles/pages/Rezervasyonlarim.css';
import NavbarHomeSingular from "../components/NavbarHomeSingular"; 

const Rezervasyonlarim = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          setError('Lütfen giriş yapın!');
          setLoading(false);
          return;
        }

        const fetchCollectionData = async (collectionName) => {
          const q = query(collection(db, collectionName), where('uid', '==', user.uid));
          const querySnapshot = await getDocs(q);
          return querySnapshot.docs.map(doc => {
            const data = doc.data();
            const selectedDate = data.selectedDate.toDate(); 
            return {
              ...data,
              selectedDate: selectedDate,
              docId: doc.id, // Belge ID'sini ekleyin
              collectionName: collectionName 
            };
          });
        };

        const userReservations = await fetchCollectionData('Rezervasyonlar');
        const userCampaignReservations = await fetchCollectionData('Kampanyalı Rezervasyonlar');

        const markedCampaignReservations = userCampaignReservations.map(res => ({
          ...res,
          isCampaignReservation: true
        }));

        const combinedReservations = [...userReservations, ...markedCampaignReservations];

        setReservations(combinedReservations);
      } catch (error) {
        setError('Rezervasyonlar yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleCancelReservation = async (reservation) => {
    try {
      console.log('İptal Edilen Rezervasyon:', reservation);

      const kafeDocRef = doc(db, 'Kafe Bilgileri', reservation.kafeId);
      const kafeSnapshot = await getDoc(kafeDocRef);

      if (kafeSnapshot.exists()) {
        const cafe = kafeSnapshot.data();
        console.log('Kafe Bilgileri:', cafe);

        const updatedData = {
          ikikisilikmasasayisi: cafe.ikikisilikmasasayisi + (reservation.selectedTables.ikiKisilik || 0),
          dortkisilikmasasayisi: cafe.dortkisilikmasasayisi + (reservation.selectedTables.dortKisilik || 0),
          altikisilikmasasayisi: cafe.altikisilikmasasayisi + (reservation.selectedTables.altiKisilik || 0),
          toplumasasayisi: cafe.toplumasasayisi + (reservation.selectedTables.toplu || 0),
        };

        console.log('Güncellenen Kafe Bilgileri:', updatedData);

        if (reservation.isCampaignReservation) {
          const confirmed = window.confirm('Kampanyalı rezervasyonu iptal etmek istediğinize emin misiniz?');
          if (!confirmed) {
            return;
          }
        }

        await updateDoc(kafeDocRef, updatedData);

        // Rezervasyonu sil
        const reservationDocRef = doc(db, reservation.collectionName, reservation.docId);
        await deleteDoc(reservationDocRef);
        console.log('Rezervasyon silindi:', reservationDocRef.id);

        // Rezervasyonları güncelle
        setReservations(prevReservations => prevReservations.filter(r => r.docId !== reservation.docId));
        console.log('Güncellenen Rezervasyonlar:', reservations);
      } else {
        console.error('Kafe bilgileri bulunamadı!');
      }
    } catch (error) {
      console.error('Rezervasyon iptal edilirken bir hata oluştu:', error);
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="reservations-container">
      <NavbarHomeSingular />
      <h2>Rezervasyonlarım</h2>
      {reservations.length === 0 ? (
        <p>Hiç rezervasyonunuz yok.</p>
      ) : (
        <div className="reservations-list">
          {reservations.map(reservation => (
            <div key={reservation.rezervasyonId} className={`reservation-card ${reservation.isCampaignReservation ? 'campaign-reservation' : ''}`}>
              <h3>{reservation.userName}</h3>
              <p><strong>Kafe:</strong> {reservation.kafeIsim}</p>
              <p><strong>Rezervasyon Tarihi:</strong> {new Date(reservation.selectedDate).toLocaleDateString()}</p>
              <p><strong>Kafe Adres Bilgisi:</strong> {reservation.kafeAdres}</p>
              <p><strong>Toplam Fiyat:</strong> {reservation.totalPrice} TL</p>
              <div className="table-details">
                <h4>Seçilen Masalar:</h4>
                <ul>
                  {Object.keys(reservation.selectedTables).map(tableType => (
                    <li key={tableType}>
                      {tableType}: {reservation.selectedTables[tableType]} adet
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={() => handleCancelReservation(reservation)}>Rezervasyonu İptal Et</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rezervasyonlarim;

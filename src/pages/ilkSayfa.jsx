import React from 'react';
import "../styles/pages/ilkSayfa.css"
import saatbir from "./images/saatuc.png"


function İlkSayfa() {
  const goToBireyselGiris = () => {
    window.location.href = "/girissingular"; // Anasayfa yolunu buraya girin
  };

  const goToKurumsalGiris = () => {
    window.location.href = "/giriscorporate"; // Favoriler yolunu buraya girin
  };

  return (
    <div className="ilkSayfa">
    <div><img src={saatbir}alt="" className='saat'/></div>
    <div className='baslik'><p>- Yerini AL -</p></div>
      <div className='metin'><p>"GEÇ OLMASIN GÜÇ DE OLMASIN"</p></div>
      <div className="buttonContainer">
        <button className="button" onClick={goToBireyselGiris}>Bireysel Giriş</button>
        <button className="button" onClick={goToKurumsalGiris}>Kurumsal Giriş</button>
      </div>
    </div>
  );
}

export default İlkSayfa;

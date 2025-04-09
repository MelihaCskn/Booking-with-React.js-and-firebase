import React from 'react';
import "../styles/pages/MekanGüncelle.css";

const MekanGüncelle = ({ cafe, onClose }) => {
  const handleSave = () => {
    // Mekan güncelleme işlemleri burada yapılacak
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Mekan Güncelle</h2>
        <p>{cafe.kafeIsim} mekanını güncelleyin</p>
        <button onClick={handleSave}>Kaydet</button>
        <button onClick={onClose}>Kapat</button>
      </div>
    </div>
  );
};

export default MekanGüncelle;

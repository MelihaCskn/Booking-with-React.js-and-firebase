import React, { useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const RezerveYap = ({ cafe, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  const customModalStyles = {
    content: {
      width: '600px',
      maxHeight: '70vh',
      margin: 'auto',
      overflow: 'auto',
    },
    overlay: {
      backgroundColor: 'rgba(1, 0, 0, 0.5)',
    },
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const convertToDate = (timestamp) => new Date(timestamp.seconds * 1000);

  const startDate = convertToDate(cafe.rezervasyonBaslangic);
  const endDate = convertToDate(cafe.rezervasyonBitis);

  const handleReserveClick = () => {
    navigate('/rezerveyapislemler', { state: { selectedDate, cafe } });
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      contentLabel="Rezerve Yap Modal"
      style={customModalStyles}
    >
      <div className="modal-header">
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
      </div>
      <div className="cafe-details">
        <h2>{cafe.kafeIsim}</h2>
        <div className="date-picker">
          <label htmlFor="reservation-date">Rezervasyon Tarihini Seçin:  </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            maxDate={endDate}
            inline
          />
        </div>
        {selectedDate && (
          <div className="selected-date">
            <p>Seçilen Tarih: {formatDate(selectedDate)}</p>
          </div>
        )}
        {selectedDate && (
          <button 
            onClick={handleReserveClick}
            style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Tarih Onayı
          </button>
        )}
      </div>
    </Modal>
  );
};

RezerveYap.propTypes = {
  cafe: PropTypes.shape({
    kafeIsim: PropTypes.string.isRequired,
    adres: PropTypes.string.isRequired,
    il: PropTypes.string.isRequired,
    ilce: PropTypes.string.isRequired,
    altikisilikmasasayisi: PropTypes.number.isRequired,
    altikisilikmasafiyati: PropTypes.number.isRequired,
    ikikisilikmasasayisi: PropTypes.number.isRequired,
    ikikisilikmasafiyati: PropTypes.number.isRequired,
    dortkisilikmasasayisi: PropTypes.number.isRequired,
    dortkisilikmasafiyati: PropTypes.number.isRequired,
    toplumasasayisi: PropTypes.number.isRequired,
    toplumasafiyati: PropTypes.number.isRequired,
    rezervasyonBaslangic: PropTypes.object.isRequired,
    rezervasyonBitis: PropTypes.object.isRequired,
    imageUrl: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RezerveYap;

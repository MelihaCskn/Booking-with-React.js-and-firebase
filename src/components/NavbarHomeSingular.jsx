import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/components/Navbar.css';

const NavbarHomeSingular = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Çıkış yapmak istediğinize emin misiniz?')) {
      navigate('/');
    }
  };

  const goToAnasayfa = () => {
    navigate('/homesingular');
  };

  const goToProfil = () => {
    navigate('/profilsingular');
  };

  const goToKampanyalarCorporate = () => {
    navigate('/kampanyalarsingular');
  };

  const goToRezerveBilgileriCorporate = () => {
    navigate('/rezervasyonlarim');
  };

  return (
    <nav>
      <div className='navbarr'>
        <div className='buttonContainerr'>
          <button className='buttonn' onClick={goToAnasayfa}>Anasayfa</button>
          <button className='buttonn' onClick={goToProfil}>Profil</button>
          <button className='buttonn' onClick={goToKampanyalarCorporate}>Kampanyalar</button>
          <button className='buttonn' onClick={goToRezerveBilgileriCorporate}>Rezervasyonlarım</button>
        </div>
        <FontAwesomeIcon icon={faSignOutAlt} className='menu-icon' onClick={handleLogout} />
      </div>
    </nav>
  );
};

export default NavbarHomeSingular;

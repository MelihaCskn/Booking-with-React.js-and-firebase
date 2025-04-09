import React from "react";
import { useNavigate } from "react-router-dom"; // useNavigate hook'unu import ediyoruz
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/components/Navbar.css';

const NavbarHomeCorporate = () => {
  const navigate = useNavigate(); // useNavigate hook'unu kullanarak navigasyon yapacağız

  const handleLogout = () => {
    if (window.confirm("Çıkış yapmak istediğinize emin misiniz?")) {
      // Çıkış onaylandığında giriş sayfasına yönlendirme
      navigate('/'); // useNavigate hook'u ile '/' sayfasına yönlendirme yapılıyor
    }
  };

  const goToAnasayfa = () => {
    window.location.href = "/homecorporate";
  };

  const goToMekanlarim = () => {
    window.location.href = "/mekanlarimcorporate";
  };

  const goToProfil = () => {
    window.location.href = "/profilcorporate";
  };

  const goToKampanyalarCorporate = () => {
    window.location.href = "/kampanyalarcorporate";
  };

  const goToRezerveBilgileriCorporate = () => {
    window.location.href = "/rezervebilgileri";
  };

 



  return (
    <nav>
      <div className='navbarr'>
      
        <div className="buttonContainerr">
          <button className="buttonn" onClick={goToAnasayfa}>Anasayfa</button>
          <button className="buttonn" onClick={goToMekanlarim}>Mekanlarım</button>
          <button className="buttonn" onClick={goToProfil}>Profil</button>
          <button className="buttonn" onClick={goToKampanyalarCorporate}>Kampanyalar</button>
          <button className="buttonn" onClick={goToRezerveBilgileriCorporate}>Rezerve Bilgileri</button>
          </div>
        <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" onClick={handleLogout} />
      </div>
        
    
    </nav>
  );
};

export default NavbarHomeCorporate;

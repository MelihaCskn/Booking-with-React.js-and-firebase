import { BrowserRouter, Route, Routes } from "react-router-dom";
import KayitSingular from "./pages/KayitSingular";
import KayitCorporate from "./pages/KayitCorporate";
import HomeSingular from "./pages/HomeSingular";
import HomeCorporate from "./pages/HomeCorporate";
import GirisCorporate from "./pages/GirisCorporate";
import GirisSingular from "./pages/GirisSingular";
import İlkSayfa from "./pages/ilkSayfa"
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ProfilCoporate from "./pages/ProfilCoporate";
import ProfilSingular from "./pages/ProfilSingular";
import MekanlarimCorporate from "./pages/MekanlarımCorporate";
import KampanyalarCorporate from "./pages/KampanyalarCorporate";
import RezerveBilgileri from "./pages/RezerveBilgileriCorporate";
import ProfilDuzenleCorporate from "./pages/ProfilDuzenleCorporate";
import MekanEkleCorporate from "./pages/MekanEkleCorporate";
import ProfilDuzenleSingular from "./pages/ProfilDuzenleSingular";
import RezerveYap from "./pages/RezerveYap";
import RezerveYapIslemler from "./pages/RezerveYapİslemler";
import Rezervasyonlarim from "./pages/Rezervasyonalarim";
import KampanyalaEkle from "./pages/KampanyaEkle";
import MekanGuncelle from "./pages/MekanGüncelle";
import SilModal from "./components/SilModal"
import KampanyalarSingular from "./pages/KampanyalarSingular";
import KampanyaRezerveSingular from "./pages/KampanyaRezerveSingular";
import KampanyaİslemlerSingular from "./pages/KampanyaİslemlerSingular";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
       
        <Routes>
          <Route path="/" element={<İlkSayfa />} />
          <Route path="/kayitsingular" element={<KayitSingular />} />
          <Route path="/kayitcorporate" element={<KayitCorporate />} />
          <Route path="/homesingular" element={<HomeSingular />} />
          <Route path="/homecorporate" element={<HomeCorporate />} />
          <Route path="/giriscorporate" element={<GirisCorporate />} />
          <Route path="/girissingular" element={<GirisSingular />} />
          <Route path="/profilcorporate" element={<ProfilCoporate />} />
          <Route path="/profilsingular" element={<ProfilSingular />} />
          <Route path="/mekanlarimcorporate" element={<MekanlarimCorporate />} />
          <Route path="/kampanyalarcorporate" element={<KampanyalarCorporate />} />
          <Route path="/rezervebilgileri" element={<RezerveBilgileri />} />
          <Route path="/profilduzenlecorporate" element={<ProfilDuzenleCorporate />} />
          <Route path="/mekaneklecorporate" element={<MekanEkleCorporate />} />
          <Route path="/profilduzenlesingular" element={<ProfilDuzenleSingular />} />
          <Route path="/rezerveyap" element={<RezerveYap />} />
          <Route path="/rezerveyapislemler" element={<RezerveYapIslemler />} />
          <Route path="/rezervasyonlarim" element={<Rezervasyonlarim />} />
          <Route path="/kampanyaekle" element={<KampanyalaEkle />} />
          <Route path="/mekangüncelle" element={<MekanGuncelle />} />
          <Route path="/silmodal" element={<SilModal />} />
          <Route path="/kampanyalarsingular" element={<KampanyalarSingular />} />
          <Route path="/kampanyarezervesingular" element={<KampanyaRezerveSingular />} />
          <Route path="/kampanyaislemlersingular" element={<KampanyaİslemlerSingular />} />

        </Routes>
      </BrowserRouter>
      <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>
<ToastContainer />
    </div>
  );
}

export default App;


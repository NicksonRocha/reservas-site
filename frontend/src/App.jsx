import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import CreateProduct from './components/CreateProduct';
import CreateAlbum from './components/CreateAlbum';


import { useAuth } from "./hooks/useAuth"


import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Business from './pages/Business/Business';
import Reservation from './pages/Reservation/Reservation';
import CreateBusiness from './pages/Business/CreateBusiness';
import ProfileBusiness from './pages/Business/ProfileBusiness';
import EditBusiness from './pages/Business/EditBusiness';
import ProfileProduct from './components/ProfileProduct';
import EditProduct from './components/EditProduct';
import SearchResultsPage from './pages/search/SearchResultsPage';
import ProfileClientProduct from './components/ProfileClientProduct';
import CreateBookingPage from './components/CreateBookingPage';
import BookingsPage from './components/BookingsPage';
import ConfirmTicket from './pages/ConfirmTicket/ConfirmTicket';
import TwiceAuth from './pages/auth/TwiceAuth';
import Profile from './pages/Profile/Profile';
import EditProfile from './pages/Profile/EditProfile';
import Configuration from './pages/Business/Configuration';
import ClientProfileBusiness from './pages/Business/ClientProfileBusiness';

function App() {
  const {auth, loading} = useAuth()

  if(loading) {
    return <p>Carregando...</p>
  }
  
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login/> } />
          <Route path="/register" element={<Register />} />
          <Route path="/entrar" element={<TwiceAuth />} />
          <Route path="/perfil" element={!auth ? <Login/> : <Profile /> } />
          <Route path="/editar" element={!auth ? <Login/> : <EditProfile /> } />
          <Route path="/business" element={!auth ? <Login/> : <Business /> } />
          <Route path="/configuracao-empresa/:id" element={!auth ? <Login/> : <Configuration /> } />
          <Route path="/reservation" element={!auth ? <Login/> : <Reservation />} />
          <Route path="/create-business" element={!auth ? <Login/> : <CreateBusiness />} />
          <Route path="/profile-business/:id" element={!auth ? <Login/> : <ProfileBusiness/>}/> 
          <Route path="/perfil/empresa/:id" element={ <ClientProfileBusiness/>}/>
          <Route path="/edit-business/:id" element={!auth ? <Login/> : <EditBusiness/>} />
          <Route path="/confirmacao-ticket/:id" element={!auth ? <Login/> : <ConfirmTicket />} />
          <Route path="/create-product/:id" element={!auth ? <Login/> : <CreateProduct/>} />
          <Route path="/product/:id" element={<ProfileProduct/>} />
          <Route path="/produto/:id" element={<ProfileClientProduct/>} />
          <Route path="/edit-product/:id" element={<EditProduct/>}/>
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/reserva" element={!auth ? <TwiceAuth/> : <CreateBookingPage/>} />
          <Route path="/lista-agendamentos/:id" element={!auth ? <Login/> : <BookingsPage />} />
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

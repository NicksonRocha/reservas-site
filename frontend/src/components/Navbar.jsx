

import styles from './Navbar.module.css';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchNotifications, markNotificationsAsRead, logout, reset } from "../slices/authSlice";
import Notifications from './Notifications';

import { sanitizeFormData } from '../utils/sanitize';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, notificationsData } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openMenu, setOpenMenu] = useState(false); 

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, user, location]);

  const unreadNotificationsCount = notificationsData?.filter(notification => !notification.isRead).length || 0;

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    window.location.href = "/"; 
  };

  const handleSearch = () => {
    const searchData = { query: searchQuery };

    const sanitizedData = sanitizeFormData(searchData);

    if (sanitizedData.query.trim()) {
      navigate(`/search?query=${encodeURIComponent(sanitizedData.query)}`);
    } else {
      alert("Por favor, insira um termo de busca válido.");
    }
  };

  const handleNotifications = () => {
    setOpenNotifications(!openNotifications);
    if (!openNotifications) {
      dispatch(markNotificationsAsRead());
    }
  };

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <nav className={styles.bar}>
      <Link to="/">
        <img src="/ReservaS.png" alt="logo-reservas" className={styles.brand} />
      </Link>
      <div>
        <form
        className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <input
            type="search"
            name="search"
            className={styles.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar produtos..."
          />
          <button type="submit" className={styles.buscar}>
            Buscar            
          </button>
          <button type="submit" className={styles.iconSearch}>            
            <img src="/iconSearch.png" alt="icone de Busca" className={styles.iconSearchImg}/>
          </button>
        </form>
      </div>

      <div className={styles.auth}>
        {!user ? (
          <>
            <Link className={styles.link} to="/login">
              Entrar
            </Link>
            <Link className={styles.link} to="/register">
              Cadastrar
            </Link>
            
            <Link to="/entrar">
              <img src="/profileIcon.png" alt="icone de entrar / cadastrar" className={styles.iconProfile}/>
            </Link>
          </>
        ) : (
          <>
            
            {openMenu && ( 
              <div className={styles.menuLinks}>
                
                <Link className={styles.linkToggle} to="/business">
                  Empresa
                </Link>
                <Link className={styles.linkToggle} to="/perfil">
                  Perfil
                </Link>
                <NavLink to="/" onClick={handleLogout} className={styles.linkQuit}>
                  Sair
                </NavLink>
              </div>
            )}<Link className={styles.linkBookings} to="/reservation">
                  Minhas Reservas 
                </Link>
                <Link className={styles.linkCalendar} to="/reservation">                 
                  <img src="/iconCalendar.png" alt="icone de calendário" className={styles.iconCalendar}/>
                </Link>
            <div className={styles.notificationsWrapper}>
              <button onClick={handleNotifications} className={styles.bellNotification}>
                <img
                  src="https://icons.iconarchive.com/icons/pictogrammers/material/128/bell-icon.png"
                  className={styles.imgBellNotification}
                  alt="Notificações"
                />
              </button>
              {unreadNotificationsCount > 0 && (
                <span className={styles.notificationBadge}>
                  {unreadNotificationsCount}
                </span>
              )}
            </div>
            <div>
            <button onClick={toggleMenu} className={styles.menuToggle}>
              <img src="/iconMenu.png" alt="icone de menu" className={styles.iconMenu}/>
            </button>
            </div>
            
            <Notifications
              isOpen={openNotifications}
              onClose={() => setOpenNotifications(false)}
              notifications={notificationsData || []}
            />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;






import React, { useState } from "react";
import style from "./TwiceAuth.module.css";

import Message from "../../components/Message";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState as useReactState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";


import {
  login,
  register,
  reset as resetAuth,
  reset as resetRegister, 
} from "../../slices/authSlice";


import { sanitizeFormData } from '../../utils/sanitize';

import ReCAPTCHA from "react-google-recaptcha";

const TwiceAuth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [loginEmail, setLoginEmail] = useReactState("");
  const [loginPassword, setLoginPassword] = useReactState("");

  const [name, setName] = useReactState("");
  const [registerEmail, setRegisterEmail] = useReactState("");
  const [registerPassword, setRegisterPassword] = useReactState("");
  const [confirmPassword, setConfirmPassword] = useReactState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, success } = useSelector((state) => state.auth);


const siteKey = import.meta.env.VITE_REACT_APP_CAPTCHA_SITE_KEY;

const handleLoginSubmit = async (e) => {
  e.preventDefault();

  const token = await window.grecaptcha.execute(siteKey, { action: "login" });
  
      if (!token) {
        alert("Erro ao gerar o token do CAPTCHA. Tente novamente.");
        return;
      }

  const userData = {
    email: loginEmail,
    password: loginPassword,
    captchaToken: token, 
  };

  const user = sanitizeFormData(userData);
  dispatch(login(user));
};

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const userData = {
      name,
      email: registerEmail,
      password: registerPassword,
      confirmPassword,
    };

     const user = sanitizeFormData(userData);


    dispatch(register(user));
  };

  useEffect(() => {
    if (success) {
      if (location.state?.nextRoute && location.state?.reservationData) {
        navigate(location.state.nextRoute, {
          state: location.state.reservationData,
        });
      } else {
        navigate("/");
      }
      dispatch(resetAuth());
    }
  }, [success, navigate, location.state, dispatch]);

  return (
    <div className={style.container}>
      <div className={style.toggleContainer}>
        <button
          className={`${style.toggleButton} ${isLogin ? style.active : ""}`}
          onClick={() => setIsLogin(true)}
        >
          Entrar
        </button>
        <button
          className={`${style.toggleButton} ${!isLogin ? style.active : ""}`}
          onClick={() => setIsLogin(false)}
        >
          Cadastrar
        </button>
      </div>

      <div className={style.formSection}>
        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className={style.form}>
            <p className={style.ordem}>Digite seu email</p>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setLoginEmail(e.target.value)}
              value={loginEmail}
              className={style.ynput}
            />
            <p className={style.ordem}>Digite sua senha</p>
            <input
              type="password"
              placeholder="Senha"
              onChange={(e) => setLoginPassword(e.target.value)}
              value={loginPassword}
              className={style.ynput}
            />
            {!loading && (
              <input type="submit" className={style.button} value="Entrar" />
            )}
            {loading && (
              <input type="submit" className={style.button} value="Aguarde" disabled />
            )}
            {error && (
              <Message className={style.error_message} msg={error} type="error" />
            )}
            
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className={style.form}>
            <p className={style.ordem}>Digite seu nome</p>
            <input
              type="text"
              placeholder="Nome"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className={style.ynput}
            />
            <p className={style.ordem}>Digite seu email</p>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setRegisterEmail(e.target.value)}
              value={registerEmail}
              className={style.ynput}
            />
            <p className={style.ordem}>Digite sua senha</p>
            <input
              type="password"
              placeholder="Senha"
              onChange={(e) => setRegisterPassword(e.target.value)}
              value={registerPassword}
              className={style.ynput}
            />
            <p className={style.ordem}>Confirme sua senha</p>
            <input
              type="password"
              placeholder="Confirme a senha"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              className={style.ynput}
            />
            {!loading && (
              <input type="submit" className={style.button} value="Cadastrar" />
            )}
            {loading && (
              <input type="submit" className={style.button} value="Aguarde" disabled />
            )}
            {error && <Message msg={error} type="error" />}
          </form>
        )}
      </div>
    </div>
  );
};

export default TwiceAuth;


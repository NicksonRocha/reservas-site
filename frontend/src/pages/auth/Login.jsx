
import style from './Auth.module.css'
import ReCAPTCHA from "react-google-recaptcha";

import { Link } from "react-router-dom"
import Message from "../../components/Message"


import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';


import { login, reset } from '../../slices/authSlice'


import { sanitizeFormData } from '../../utils/sanitize';

const Login = () => {

    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const dispatch = useDispatch()
    const navigate = useNavigate();

    const { loading, error, success } = useSelector((state) => state.auth)

   
    const siteKey = import.meta.env.VITE_REACT_APP_CAPTCHA_SITE_KEY;

  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      
      const token = await window.grecaptcha.execute(siteKey, { action: "login" });
  
      if (!token) {
        alert("Erro ao gerar o token do CAPTCHA. Tente novamente.");
        return;
      }
  
      const userData = {
        email,
        password,
        captchaToken: token, 
      };

      
      const user = sanitizeFormData(userData);
  
      dispatch(login(user));
    } catch (error) {
      
      alert("Erro ao validar o CAPTCHA. Por favor, tente novamente.");
    }
  };
  
    
    useEffect(() => {
      dispatch(reset())
    }, [dispatch])

    useEffect(() => {
      if (success) {
          navigate('/'); 
      }
  }, [success, navigate]);
    

  return (
    <div className={style.formcontainer}>
      <form onSubmit={handleSubmit} className={style.form}>
        
        <p className={style.ordem}>Digite seu email</p>
        <input type="email"
        placeholder='Email'
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        className={style.ynput}
        />
        <p className={style.ordem}>Digite sua senha</p>
        <input type="password"
        placeholder='Senha'
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className={style.ynput}
        />

     

      {!loading && <input type="submit" className={style.button} value="Entrar" />}
      {loading && <input type="submit" className={style.button} value="Aguarde" disabled />}
      {error && <Message className={style.error_message} msg={error} type="error"/>}
        
       <p>Não tem uma conta ? <Link className={style.link} to="/register">Clique aqui.</Link></p>

      </form>
    </div>
  )
}

export default Login


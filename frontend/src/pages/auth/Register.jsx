

import style from './Auth.module.css'


import { Link } from 'react-router-dom'
import Message from '../../components/Message'


import { useState, useEffect } from 'react'
import {useSelector, useDispatch} from "react-redux"
import { useNavigate } from 'react-router-dom';


import { register, reset } from "../../slices/authSlice"


import { sanitizeFormData } from '../../utils/sanitize';

const Register = () => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const dispatch = useDispatch()
    const navigate = useNavigate();

    const {success, loading, error} = useSelector((state) => state.auth)

    

    const handleSubmit = (e) => {

      e.preventDefault()

       const userData = {
      name,
      email,
      password,
      confirmPassword
    }

    
     const user = sanitizeFormData(userData);

    dispatch(register(user))

    }

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
        <p className={style.ordem}>Digite seu nome</p>
        <input type="text"
        placeholder='Nome'
        onChange={(e) => setName(e.target.value)}
        value={name}
        className={style.ynput}
        />
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
        <p className={style.ordem}>Confirme sua senha</p>
        <input type="password"
        placeholder='confirme a senha'
        onChange={(e) => setConfirmPassword(e.target.value)}
        value={confirmPassword}
        className={style.ynput}
        />

      {!loading &&  <input type="submit" className={style.button} value="Cadastrar" />}
      {loading && <input type="submit" className={style.button} value="Aguarde" disabled />}
      {error && <Message msg={error} type="error"/>}

      </form>

      <p >Já tem conta ? <Link className={style.link} to="/login">Clique aqui.</Link> </p>
    </div>
  )
}

export default Register



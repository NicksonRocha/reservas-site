const express = require('express')
const rateLimit = require('express-rate-limit');
const { userCreateValidation, loginValidation, userUpdateValidation } = require('../middlewares/userValidation')
const validate = require('../middlewares/handleValidation')
const { register, login, perfil, update, viewProfile, notifications, markNotificationsAsRead, deleteAccount } = require('../controllers/UserControllers')
const authGuard = require('../middlewares/authGuard')

const userRoute = express()

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: { errors: ["Muitas tentativas de login. Tente novamente mais tarde."] }, 
    standardHeaders: true,
    legacyHeaders: false,
  });

userRoute.delete('/delete', authGuard, deleteAccount)

userRoute.put('/notifications/mark-as-read', authGuard, markNotificationsAsRead);
userRoute.get('/notifications', authGuard, notifications)

userRoute.get('/view-profile/:id', viewProfile)

userRoute.put('/edit', authGuard, userUpdateValidation(), validate, update) 

userRoute.get('/perfil', authGuard, perfil)

userRoute.post("/login", loginLimiter, loginValidation(), validate, login)

userRoute.post("/register", userCreateValidation(), validate, register)


module.exports = userRoute
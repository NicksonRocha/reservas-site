const express = require('express')
const { registerBusiness, editBusiness, perfilBusiness, viewProfileBusiness, myBusiness, upMulter, deleteBusinessProfileImage, getBusinessNotifications, markNotificationsBusinessAsRead, deleteBusiness, clientSeePerfilBusiness,  } = require('../controllers/BusinessController')
const validate = require('../middlewares/handleValidation')
const { businessCreateValidation, businessEditValidation } = require('../middlewares/businessValidation')
const authGuard = require('../middlewares/authGuard')
const businessRoute = express()

businessRoute.put('/is-read-business/:id', authGuard, markNotificationsBusinessAsRead)

businessRoute.get('/notifications-business/:id', authGuard, getBusinessNotifications)

businessRoute.get('/my-business', authGuard, myBusiness)

businessRoute.get('/view-profile/business/:id', viewProfileBusiness)

businessRoute.get('/client-view/profile-business/:id', clientSeePerfilBusiness)

businessRoute.get('/perfil/business/:id', authGuard, perfilBusiness)

businessRoute.delete('/edit/delete-image/:id', authGuard, deleteBusinessProfileImage)

businessRoute.delete('/delete/business/:id', authGuard, deleteBusiness);

businessRoute.put(
    '/edit/business/:id', 
    authGuard, 
    upMulter.single('profileImage'),  
    businessEditValidation(), 
    validate, 
    editBusiness
);

businessRoute.post(
    '/create/business', 
    authGuard, 
    upMulter.single('profileImage'),  
    businessCreateValidation(), 
    validate, 
    registerBusiness
);

module.exports = businessRoute
const Business = require('../models/Business')
const Booking = require('../models/Booking')
const User = require('../models/User')
const Notification = require('../models/Notification');
const NotificationBusiness = require('../models/NotificationBusiness');
const axios = require("axios");

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const jwtSecret = process.env.JWT_SECRET

// generate user token 
const generateToken = (id) => {
    return jwt.sign({id}, jwtSecret, {
        expiresIn: "7d"
    })
}
const verifyCaptcha = async (captchaToken) => {
  const secretKey = process.env.CAPTCHA_SECRET_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify`;

  try {
    const response = await axios.post(url, null, {
      params: {
        secret: secretKey,
        response: captchaToken,
      },
    });

    if (response.data.score < 0.5) {
      return {
        success: false,
        message: "Comportamento suspeito detectado. Tente novamente mais tarde.",
      };
    }

    return {
      success: response.data.success,
      score: response.data.score,
    };
  } catch (error) {
    console.error("Erro ao verificar CAPTCHA:", error);
    throw new Error("Erro ao verificar CAPTCHA.");
  }
};


const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ errors: ["O nome não pode estar vazio."] });
  }
  if (!email || email.trim() === "") {
    return res.status(400).json({ errors: ["O e-mail não pode estar vazio."] });
  }
  if (!password || password.trim() === "") {
    return res.status(400).json({ errors: ["A senha não pode estar vazia."] });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(422).json({ errors: ["Por favor utilize outro e-mail."] });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: passwordHash,
    });

    if (!newUser) {
      return res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde."] });
    }

    const notification = await Notification.create({
      userId: newUser.id,
      message: `Parabéns ${name}, sua conta foi criada com sucesso! Seja bem-vindo ao Reservas.`,
    });

    return res.status(201).json({
      id: newUser.id,
      token: generateToken(newUser.id),
      notification,
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return res.status(500).json({ errors: ["Erro interno no servidor."] });
  }
};

const loginAttempts = new Map();

const login = async (req, res) => {
  const { email, password, captchaToken } = req.body;

  const now = Date.now();
  const baseLockoutTime = 5 * 60 * 1000; 
  const maxAttempts = 5;

  const userAttempts = loginAttempts.get(email) || {
    count: 0,
    lastAttempt: now,
    lockoutMultiplier: 0,
  };

  if (userAttempts.lockedUntil && now < userAttempts.lockedUntil) {
    const timeLeft = Math.ceil((userAttempts.lockedUntil - now) / 1000);
    return res.status(429).json({
      errors: [`Muitas tentativas de login. Tente novamente em ${timeLeft} segundos.`],
    });
  }

  if (userAttempts.count >= 3) {
    if (!captchaToken) {
      return res.status(400).json({
        errors: ["Por favor, resolva o CAPTCHA para continuar."],
      });
    }

    try {
      const isCaptchaValid = await verifyCaptcha(captchaToken);
      if (!isCaptchaValid) {
        return res.status(400).json({
          errors: ["CAPTCHA inválido. Tente novamente."],
        });
      }
    } catch (error) {
      return res.status(500).json({ errors: ["Erro ao verificar CAPTCHA."] });
    }
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      const newMultiplier =
        userAttempts.count + 1 >= maxAttempts
          ? userAttempts.lockoutMultiplier + 1
          : userAttempts.lockoutMultiplier;

      loginAttempts.set(email, {
        count: userAttempts.count + 1,
        lastAttempt: now,
        lockoutMultiplier: newMultiplier,
        lockedUntil:
          userAttempts.count + 1 >= maxAttempts
            ? now + baseLockoutTime * Math.pow(2, newMultiplier)
            : null,
      });

      return res.status(422).json({
        errors: ["Senha incorreta ou email inexistente."],
      });
    }

    loginAttempts.delete(email);

    const token = generateToken(user.id);

    res.status(201).json({
      id: user.id,
      token,
    });
  } catch (error) {
    console.error("Erro ao processar login:", error);
    return res.status(500).json({
      errors: ["Erro ao processar login."],
    });
  }
};


const perfil = async (req, res) => {

    const reqUser = req.user

    const user = await User.findOne({
        where: { id: reqUser.id },
        attributes: { exclude: ["password"] } 
    });

    if(!user) return res.status(404).json({ errors: ["Erro, tente novamente mais tarde."] })

    res.status(201).json(user)

}

const viewProfile = async (req, res) => {

    const {id} = req.params

    const profile = await User.findByPk(id, {attributes: { exclude: ["password"]}})

    res.status(200).json(profile)

}


const update = async (req, res) => {
  const { name, currentPassword, newPassword } = req.body;
  const reqUser = req.user;

  try {
    const user = await User.findByPk(reqUser.id);

    if (!user) {
      return res.status(404).json({ errors: ["Usuário não encontrado."] });
    }

    if (name) {
      user.name = name;
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ errors: ["Senha atual é obrigatória para alterar a senha."] });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

      if (!isPasswordValid) {
        return res.status(422).json({ errors: ["Senha atual incorreta."] });
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({
      id: user.id,
      name: user.name,
      message: "Perfil atualizado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao atualizar o perfil:", error);
    res.status(500).json({ error: 'Erro ao editar o perfil.', details: error.message })
  }
};

const notifications = async (req, res) => {
    try {
      const reqUser = req.user; 

      const userNotifications = await Notification.findAll({
        where: { userId: reqUser.id },
        order: [['createdAt', 'DESC']],
      });
  
      if (!userNotifications || userNotifications.length === 0) {
        return res.status(200).json({
          message: "Nenhuma notificação encontrada.",
          notifications: [],
        });
      }
  
      const notificationData = userNotifications.map((notification) => ({
        id: notification.id,
        message: notification.message,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
      }));
  
      return res.status(200).json({
        message: "Notificações carregadas com sucesso.",
        notifications: notificationData,
      });
    } catch (error) {
      console.error("Erro ao buscar notificações do usuário:", error);
      return res.status(500).json({
        errors: ["Erro ao buscar as notificações do usuário."],
      });
    }
  };
  

  const markNotificationsAsRead = async (req, res) => {
    try {
      const reqUser = req.user; 

      const unreadNotifications = await Notification.findAll({
        where: {
          userId: reqUser.id,
          isRead: false,
        },
      });
  
      if (!unreadNotifications || unreadNotifications.length === 0) {
        return res.status(200).json({
          message: "Todas as notificações já estão lidas.",
          notifications: [],
        });
      }
  
      await Notification.update(
        { isRead: true },
        {
          where: {
            userId: reqUser.id,
            isRead: false,
          },
        }
      );
  
      return res.status(200).json({
        message: "Notificações não lidas foram marcadas como lidas.",
        updatedNotificationsCount: unreadNotifications.length,
      });
    } catch (error) {
      console.error("Erro ao atualizar notificações para lidas:", error);
      return res.status(500).json({
        errors: ["Erro ao atualizar notificações para lidas."],
      });
    }
  };
  


  const deleteAccount = async (req, res) => {
    try {
      const reqUser = req.user; 

      const userBusinesses = await Business.findOne({
        where: { UserId: reqUser.id }, 
      });
      
      if (userBusinesses) {
        return res.status(403).json({
          errors: [
            "Você possui empresas registradas. Exclua todas as suas empresas antes de deletar sua conta.",
          ],
        });
      }
  
      await Booking.destroy({ where: { userId: reqUser.id } });
  
      await Notification.destroy({ where: { userId: reqUser.id } });
      await NotificationBusiness.destroy({ where: { userId: reqUser.id } });
  
      await User.destroy({ where: { id: reqUser.id } });
  
      return res.status(200).json({ message: "Conta excluída com sucesso." });
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      return res
        .status(500)
        .json({ errors: ["Erro interno no servidor. Tente novamente mais tarde."] });
    }
  };



module.exports = {
    register,
    login,
    perfil,
    update,
    viewProfile,
    notifications,
    markNotificationsAsRead,
    deleteAccount 
}
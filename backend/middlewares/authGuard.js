const User = require('../models/User');
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const authGuard = async (req, res, next) => {
    
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ errors: ["Acesso negado!"] });
    }

    try {
        const verified = jwt.verify(token, jwtSecret);

        const user = await User.findByPk(verified.id, { 
            attributes: { exclude: ["password"] }
        });

        if (!user) {
            return res.status(404).json({ errors: ["Usuário não encontrado."] });
        }

        req.user = user;

        console.log("Usuário encontrado:", req.user);

        next();

    } catch (error) {

        console.error("Erro ao verificar o token:", error);

        return res.status(401).json({ errors: ["Token inválido."] });
    }
}

module.exports = authGuard;


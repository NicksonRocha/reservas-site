

const express = require('express');
const userRoute = require('./userRoute');
const businessRoute = require('./businessRoute');
const productRoute = require('./productRoute');
const { promotionHome, searchProducts } = require('../controllers/ProductController');
const { searchAll } = require('../controllers/SearchController');
const multer = require("multer");
const sanitizeHtml = require("sanitize-html");

const router = express();

const sanitizeMiddleware = (req, res, next) => {

  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        req.body[key] = sanitizeHtml(req.body[key], {
          allowedTags: [], 
          allowedAttributes: {},
        });
      }
    });
  }

  if (req.query) {
    Object.keys(req.query).forEach((key) => {
      if (typeof req.query[key] === "string") {
        req.query[key] = sanitizeHtml(req.query[key], {
          allowedTags: [],
          allowedAttributes: {},
        });
      }
    });
  }

  next();
};

router.use(productRoute);
router.use(businessRoute);
router.use(userRoute);

router.get('/search', searchAll);
router.get("/", promotionHome);

router.use((error, req, res, next) => {
  console.error("Erro capturado pelo middleware:", error);

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ errors: ["Você pode enviar no máximo 6 imagens."] });
    }
    return res.status(400).json({ errors: [error.message] });
  }

  if (error.message && error.message.includes("permitidas")) {
    return res.status(400).json({ errors: ["Apenas imagens PNG, JPG e JPEG são permitidas."] });
  }

  return res.status(500).json({ errors: ["Ocorreu um erro no servidor, tente novamente mais tarde."] });
});

router.use(sanitizeMiddleware);

module.exports = router;

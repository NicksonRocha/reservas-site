const { body } = require("express-validator")

const businessCreateValidation = () => {
    return [
        body("name")
            .isString()
            .withMessage("O nome da empresa é obrigatório.")
            .isLength({min: 2})
            .withMessage("O nome precisa ter no mínimo 2 caracteres."),
        body("category")
            .notEmpty()
            .withMessage("A categoria de empresa é obrigatória."),
        body("cnpj")
            .notEmpty()
            .withMessage("O CNPJ é obrigatório.")
            .isNumeric()
            .withMessage("O CNPJ deve conter apenas números.")
            .isLength({ min: 14, max: 14 })
            .withMessage("O CNPJ deve ter exatamente 14 dígitos.")
    ]
}
const businessEditValidation = () => {
    return [
        
        body("name")
            .optional() 
            .isString()
            .withMessage("O nome da empresa deve ser uma string.")
            .isLength({ min: 2 })
            .withMessage("O nome precisa ter no mínimo 2 caracteres."),
        
        body("category")
            .optional() 
            .notEmpty()
            .withMessage("A categoria de empresa não pode estar vazia."),
    ]
}

module.exports = {
    businessCreateValidation,
    businessEditValidation
}
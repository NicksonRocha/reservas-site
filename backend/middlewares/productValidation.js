const { body } = require("express-validator");

const productCreateValidation = () => {
    return [
        body("title")
            .isString()
            .withMessage("O nome do produto é obrigatório.")
            .isLength({ min: 2 })
            .withMessage("O nome precisa ter no mínimo 2 caracteres."),
        body("price")
            .notEmpty()
            .withMessage("O preço é obrigatório.")
            .isFloat({ min: 0.00 })
            .withMessage("O preço deve ser um valor numérico positivo.")
            .custom(value => {
                if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                    throw new Error("O preço deve ter no máximo duas casas decimais.");
                }
                return true;
            }),
    ];
};

const productEditValidation = () => {
    return [
        body("title")
            .optional()
            .isString()
            .withMessage("O nome do produto deve ser uma string.")
            .isLength({ min: 2 })
            .withMessage("O nome precisa ter no mínimo 2 caracteres."),
        body("price")
            .optional()
            .isFloat({ min: 0.00 })
            .withMessage("O preço deve ser um valor numérico positivo.")
            .custom(value => {
                if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                    throw new Error("O preço deve ter no máximo duas casas decimais.");
                }
                return true;
            }),
        body("promotion")
            .optional()
            .isBoolean()
            .withMessage("Promoção deve ser um valor booleano."),
        body("duration")
            .optional()
            .isInt({ min: 0 })
            .withMessage("A duração deve ser um número inteiro positivo."),
    ];
};

module.exports = {
    productCreateValidation,
    productEditValidation,
};

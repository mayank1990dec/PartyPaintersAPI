"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
exports.createStreetMapModel = Joi.array().items({
    id: Joi.string(),
    zone: Joi.string(),
    long: Joi.string(),
    lighttype: Joi.string(),
    lightcount: Joi.string(),
    wattage: Joi.array(),
    wardno: Joi.string(),
    ccmsno: Joi.string(),
    lat: Joi.string()
});
//# sourceMappingURL=streetmap-validator.js.map
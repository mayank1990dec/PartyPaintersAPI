"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
exports.WattageSchema = new Mongoose.Schema({
    watt: { type: Number, index: true },
    qty: { type: Number, index: true },
});
exports.WattageModel = Mongoose.model('Wattage', exports.WattageSchema);
exports.StreetMapSchema = new Mongoose.Schema({
    id: { type: String, index: true },
    zone: { type: String, index: true },
    long: { type: String, index: true },
    lighttype: { type: String, index: true },
    lightcount: { type: String, index: true },
    wattage: [exports.WattageSchema],
    wardno: { type: String, index: true },
    ccmsno: { type: String, index: true },
    lat: { type: String, index: true }
}, {
    timestamps: true
});
exports.StreetMapModel = Mongoose.model('StreetMap', exports.StreetMapSchema);
//# sourceMappingURL=streetmap.js.map
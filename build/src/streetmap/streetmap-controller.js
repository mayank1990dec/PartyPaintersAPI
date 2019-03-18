"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Boom = require("boom");
class StreetMapController {
    constructor(configs, database) {
        this.configs = configs;
        this.database = database;
    }
    createStreetMap(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            var newStreetMap = request.payload;
            try {
                let streetmap = yield this.database.streetMapModel.create(newStreetMap);
                return reply(streetmap).code(201);
            }
            catch (error) {
                return reply(Boom.badImplementation(error));
            }
        });
    }
    Delete(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            var newStreetMap = request.payload;
            try {
                yield this.database.streetMapModel.remove({});
                return reply().code(201);
            }
            catch (error) {
                return reply(Boom.badImplementation(error));
            }
        });
    }
    getZones(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            let filteredData;
            if (request.query['zone']) {
                let zone = { zone: { $in: Array.from(request.query['zone'].split(',')) } };
                filteredData = yield this.database.streetMapModel.find(zone).lean(true);
                filteredData = filteredData.map(p => p.wardno).filter((x, i, a) => a.indexOf(x) === i);
            }
            else if (request.query['wardno']) {
                let ward = { wardno: { $in: Array.from(request.query['wardno'].split(',')) } };
                filteredData = yield this.database.streetMapModel.find(ward).lean(true);
                filteredData = filteredData.map(x => x.ccmsno).filter((x, i, a) => a.indexOf(x) === i);
            }
            else {
                filteredData = yield this.database.streetMapModel.find({}).lean(true);
                filteredData = filteredData.map(x => x.zone).filter((x, i, a) => a.indexOf(x) === i);
            }
            return reply(filteredData);
        });
    }
    getStreetmap(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = [];
            let maps = [];
            if (request.query['zone']) {
                // { qty: { $in: [ 5, 15 ] } }
                // filter['zone'] = { $in: Array.from(request.query['zone'].split(',')) };
                filter.push({ zone: { $in: Array.from(request.query['zone'].split(',')) } });
            }
            if (request.query['ccmsno']) {
                filter.push({ ccmsno: { $in: Array.from(request.query['ccmsno'].split(',')) } });
            }
            if (request.query['watt']) {
                let watt = [];
                let range = request.query['watt'].replace(/\s/g, "").split('-');
                let wattArray = request.query['watt'].split(',');
                // {$or: [{'wattage.watt':{$gte:22,$lte:24}},{'wattage.watt':{$gte:21,$lte:21}}]}
                // {$and :[watt,{ccmsno:{$in: [ 'CZ-157-001', 'CZ-157-002' ]}}]}
                //{ $and: [{ $or: watt }, { ccmsno: { $in: ['CZ-157-001', 'CZ-157-002'] } }] }
                //{ $in: Array.from(request.query['ccmsno'].split(',')) };
                //{ $in: Array.from(request.query['ccmsno'].split(',')) };
                //{$and: [{ $or: [ { 'wattage.watt': { $gte: 22, $lte: 24 } }, { 'wattage.watt': { $gte: 9, $lte: 50 } } ]},{ ccmsno: { $in: [ 'CZ-157-001', 'CZ-157-002' ] }}]}
                wattArray.map((item) => {
                    let range = item.split('-');
                    watt.push({ 'wattage.watt': { $gte: Number(range[0]), $lte: Number(range[1]) } });
                });
                if (watt.length > 0) {
                    filter.push({ $or: watt });
                }
            }
            if (filter.length > 0) {
                maps = yield this.database.streetMapModel.find({ $and: filter }).lean(true);
            }
            else {
                maps = yield this.database.streetMapModel.find({}).lean(true);
            }
            return reply(maps);
        });
    }
}
exports.default = StreetMapController;
//# sourceMappingURL=streetmap-controller.js.map
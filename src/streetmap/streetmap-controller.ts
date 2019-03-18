import * as Hapi from "hapi";
import * as Boom from "boom";
import { IStreetMap } from "./StreetMap";
import { IDatabase } from "../database";
import { IServerConfigurations } from "../configurations";
import { JsonWebTokenError } from "jsonwebtoken";

export default class StreetMapController {

    private database: IDatabase;
    private configs: IServerConfigurations;

    constructor(configs: IServerConfigurations, database: IDatabase) {
        this.configs = configs;
        this.database = database;
    }

    public async createStreetMap(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        var newStreetMap: IStreetMap[] = request.payload;
        try {
            let streetmap: IStreetMap[] = await this.database.streetMapModel.create(newStreetMap);
            return reply(streetmap).code(201);
        } catch (error) {
            return reply(Boom.badImplementation(error));
        }
    }
    public async Delete(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        var newStreetMap: IStreetMap[] = request.payload;
        try {
            await this.database.streetMapModel.remove({});
            return reply().code(201);
        } catch (error) {
            return reply(Boom.badImplementation(error));
        }
    }

    public async getZones(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        let filteredData;
        if (request.query['zone']) {
            let zone = { zone: { $in: Array.from(request.query['zone'].split(',')) } };
            filteredData = await this.database.streetMapModel.find(zone).lean(true);
            filteredData = filteredData.map(p => p.wardno).filter((x, i, a) => a.indexOf(x) === i);
        } else if (request.query['wardno']) {
            let ward = { wardno: { $in: Array.from(request.query['wardno'].split(',')) } };
            filteredData = await this.database.streetMapModel.find(ward).lean(true);
            filteredData = filteredData.map(x => x.ccmsno).filter((x, i, a) => a.indexOf(x) === i);
        } else {
            filteredData = await this.database.streetMapModel.find({}).lean(true);
            filteredData = filteredData.map(x => x.zone).filter((x, i, a) => a.indexOf(x) === i);
        }
        return reply(filteredData);
    }

    public async getStreetmap(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {

        let filter: any = [];
        let maps: any = [];
        if (request.query['zone']) {
            // { qty: { $in: [ 5, 15 ] } }
            // filter['zone'] = { $in: Array.from(request.query['zone'].split(',')) };
            filter.push({ zone: { $in: Array.from(request.query['zone'].split(',')) } });
        }
        if (request.query['ccmsno']) {
            filter.push({ ccmsno: { $in: Array.from(request.query['ccmsno'].split(',')) } });
        }
        if (request.query['watt']) {
            let watt: any = [];
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
            maps = await this.database.streetMapModel.find({ $and: filter }).lean(true);
        } else {
            maps = await this.database.streetMapModel.find({}).lean(true);
        }

        return reply(maps);
    }
}
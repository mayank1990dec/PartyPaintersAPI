import * as Hapi from "hapi";
import * as Joi from "joi";
import { jwtValidator } from "../users/user-validator";
import { IDatabase } from "../database";
import * as StreetMapValidator from "./streetmap-validator";

import { IServerConfigurations } from "../configurations";
import StreetMapController from "./streetmap-controller";

export default function (server: Hapi.Server, configs: IServerConfigurations, database: IDatabase) {

    const streetMapController = new StreetMapController(configs, database);
    server.bind(streetMapController);

    server.route({
        method: 'GET',
        path: '/maps',
        config: {
            handler: streetMapController.getStreetmap,
            // auth: "jwt",
            tags: ['api', 'maps'],
            description: 'Get all maps.',
            validate: {
                query: {
                    zone: Joi.string(),
                    ccmsno: Joi.string(),
                    watt: Joi.string(),
                },
                //headers: jwtValidator
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/maps/zones',
        config: {
            handler: streetMapController.getZones,
            // auth: "jwt",
            tags: ['api', 'maps'],
            description: 'Get all zones.',
            validate: {
                query: {
                    zone: Joi.string(),
                    wardno: Joi.string()
                },
                //headers: jwtValidator
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/maps',
        config: {
            handler: streetMapController.Delete,
            // auth: "jwt",
            tags: ['api', 'maps'],
            description: 'Delete all maps.',
            validate: {
                // query: {
                //     filter: Joi.string(),
                //     zone: Joi.string()
                // },
                //headers: jwtValidator
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/maps',
        config: {
            handler: streetMapController.createStreetMap,
            // auth: "jwt",
            tags: ['api', 'maps'],
            description: 'Create a maps.',
        payload: {
                parse: true,
                maxBytes: 100 * Math.pow(2, 20)
            },
            validate: {
                payload: StreetMapValidator.createStreetMapModel,
                //headers: jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '201': {
                            'description': 'Created Maps.'
                        }
                    }
                }
            }
        }
    });
}
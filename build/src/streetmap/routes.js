"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const StreetMapValidator = require("./streetmap-validator");
const streetmap_controller_1 = require("./streetmap-controller");
function default_1(server, configs, database) {
    const streetMapController = new streetmap_controller_1.default(configs, database);
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
            validate: {}
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
exports.default = default_1;
//# sourceMappingURL=routes.js.map
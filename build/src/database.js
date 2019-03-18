"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const user_1 = require("./users/user");
const task_1 = require("./tasks/task");
const streetmap_1 = require("./streetmap/streetmap");
function init(config) {
    // process.env.MONGO_URL = undefined;
    Mongoose.Promise = Promise;
    //  Mongoose.connect(process.env.MONGO_URL || config.connectionString);
    Mongoose.connect(config.connectionString);
    let mongoDb = Mongoose.connection;
    mongoDb.on('error', () => {
        console.log(`Unable to connect to database: ${process.env.MONGO_URL || config.connectionString}`);
    });
    mongoDb.once('open', () => {
        console.log(`Connected to database: ${process.env.MONGO_URL || config.connectionString}`);
    });
    return {
        taskModel: task_1.TaskModel,
        userModel: user_1.UserModel,
        streetMapModel: streetmap_1.StreetMapModel
    };
}
exports.init = init;
//# sourceMappingURL=database.js.map
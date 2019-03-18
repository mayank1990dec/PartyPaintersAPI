import * as Mongoose from "mongoose";
import { IDataConfiguration } from "./configurations";
import { IUser, UserModel } from "./users/user";
import { ITask, TaskModel } from "./tasks/task";
import { IStreetMap, StreetMapModel } from "./streetmap/streetmap";

export interface IDatabase {
    userModel: Mongoose.Model<IUser>;
    taskModel: Mongoose.Model<ITask>;
    streetMapModel: Mongoose.Model<IStreetMap>;
}

export function init(config: IDataConfiguration): IDatabase {
    // process.env.MONGO_URL = undefined;
    (<any>Mongoose).Promise = Promise;
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
        taskModel: TaskModel,
        userModel: UserModel,
        streetMapModel: StreetMapModel
    };
}
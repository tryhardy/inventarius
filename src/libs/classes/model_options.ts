import { InitOptions } from "sequelize";
import db from "../../db";

export class ModelOptions implements InitOptions
{
    sequelize = db;
    timestamps: boolean = true;
    createdAt: string = 'date_create';
    updatedAt: string = 'date_update';
    tableName: string;

    constructor(name : string)
    {
        this.tableName = name
    }
}
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const toPascal_js_1 = __importDefault(require("./toPascal.js"));
const createFields_js_1 = __importDefault(require("./createFields.js"));
const createType = (name, data, description, option) => {
    const { matchWithTypeName, nonNull, idTypeOff } = option || {};
    const pascalName = (0, toPascal_js_1.default)(name);
    return new graphql_1.GraphQLObjectType({
        name: pascalName + 'Type',
        description,
        fields: (0, createFields_js_1.default)(data, {
            useIDType: !idTypeOff,
            matchWithTypeName,
            nonNull,
        }),
    });
};
exports.default = createType;

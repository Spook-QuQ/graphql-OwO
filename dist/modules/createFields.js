"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const toPascal_js_1 = __importDefault(require("./toPascal.js"));
const objectTypeDetector_js_1 = __importDefault(require("./objectTypeDetector.js"));
const createFields = (data, 
// data: any,
option) => {
    const { useIDType, matchWithTypeName } = option || {};
    return Object.keys(data).reduce((prev, key) => {
        if (typeof data === 'string') {
            if (useIDType && key === 'id')
                prev[key] = { type: graphql_1.GraphQLID };
            else
                prev[key] = (0, objectTypeDetector_js_1.default)(data[key], { matchWithTypeName });
        }
        if (Array.isArray(data[key])) {
            if (!data[key].length)
                throw new Error('Array length is 0');
            let rsName;
            if (key.match(/s$/))
                rsName = (0, toPascal_js_1.default)(key).slice(0, -1);
            else
                rsName = (0, toPascal_js_1.default)(key);
            let whichData;
            if (typeof data[key][0] === 'object')
                whichData = data[key][0];
            else
                whichData = { [rsName]: data[key][0] };
            const listType = new graphql_1.GraphQLList(new graphql_1.GraphQLObjectType({
                name: rsName + 'Type',
                fields: createFields(whichData, option),
            }));
            prev[key] = { type: listType };
            return prev;
        }
        if (typeof data[key] === 'object') {
            prev[key] = {
                type: new graphql_1.GraphQLObjectType({
                    name: (0, toPascal_js_1.default)(key) + 'Type',
                    fields: createFields(data[key], option),
                }),
            };
            return prev;
        }
        return prev;
    }, {});
};
exports.default = createFields;

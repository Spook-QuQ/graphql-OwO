"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphiqlHTML = void 0;
const fs = require('fs');
const path = require('path');
const graphql_1 = require("graphql");
const createType_js_1 = __importDefault(require("./modules/createType.js"));
const createArgs_js_1 = __importDefault(require("./modules/createArgs.js"));
const createRootType = (types, option, description) => {
    const { isMutation } = option || {};
    const rsQueries = types.reduce((rsQuery, type) => {
        const args = Object.keys(type.args || {}).length
            ? (0, createArgs_js_1.default)(type.args)
            : null;
        const ctx = {
            type: (0, createType_js_1.default)(type.name, type.fields, type.typeDescription, {
                matchWithTypeName: true,
                idTypeOff: type.idTypeOff,
            }),
            description: type.description,
            args,
            // 🍄
            resolver: typeof type.resolver === 'function'
                ? ((_, args) => {
                    return type.resolver(args);
                })
                : null,
        };
        rsQuery[type.name] = ctx;
        if (type.list) {
            const ctxForPlural = {
                type: new graphql_1.GraphQLList(ctx.type),
                description: type.listDescription,
                args: (0, createArgs_js_1.default)(type.listArgs),
                // 🍄
                resolver: typeof type.listResolver === 'function'
                    ? ((_, args) => {
                        return type.resolver(args);
                    })
                    : null,
            };
            rsQuery[type.name + 's'] = ctxForPlural;
        }
        return rsQuery;
    }, {});
    return new graphql_1.GraphQLObjectType({
        name: isMutation ? 'Mutation' : 'Query',
        description,
        fields: rsQueries, // 🍄
    });
};
const createSchema = (_query, _mutation, description) => {
    const ctx = {
        query: _query ? createRootType(_query, null, description.query) : null,
        mutation: _mutation
            ? createRootType(_mutation, { isMutation: true }, description.mutation)
            : null,
    };
    return new graphql_1.GraphQLSchema(ctx);
};
class GraphqlOwO {
    constructor(_schema) {
        const THIS = Symbol('THIS');
        const { query, mutation, description } = _schema;
        this[THIS] = {
            schema: createSchema(query, mutation, description)
        };
        this.run = (_query, _variables /* ← request variables */) => __awaiter(this, void 0, void 0, function* () {
            return yield (0, graphql_1.graphql)({
                schema: this[THIS].schema,
                variableValues: _variables,
                source: _query,
            });
        });
    }
}
exports.default = GraphqlOwO;
const graphiqlHTML = (url) => {
    const html = fs.readFileSync(path.resolve(__dirname, './static/graphiql.html'));
    return html.toString().replace('[[__req_url__]]', url || '/api/graphql');
};
exports.graphiqlHTML = graphiqlHTML;

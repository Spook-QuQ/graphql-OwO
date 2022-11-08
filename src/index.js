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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.graphiqlHTML = void 0;
var fs = require('fs');
var path = require('path');
var graphql_1 = require("graphql");
var createType_js_1 = require("./modules/createType.js");
// const createInputType = require('./modules/createInputType.js')
var createArgs_js_1 = require("./modules/createArgs.js");
var createRootType = function (types, option, description) {
    var isMutation = (option || {}).isMutation;
    var fields = types.reduce(function (rsQuery, type) {
        // type Context = {
        //   type?: any
        //   description?: any
        //   args?: ArgumentsType
        //   resolve?: any
        // } // 🍄
        var args = Object.keys(type.args || {}).length
            ? (0, createArgs_js_1["default"])(type.args)
            : null;
        var ctx = {
            type: (0, createType_js_1["default"])(type.name, type.fields, type.typeDescription, {
                matchWithTypeName: true,
                idTypeOff: type.idTypeOff
            }),
            description: type.description,
            args: args,
            resolve: typeof type.resolve === 'function'
                ? (function (_, args) {
                    return type.resolve(args);
                })
                : null
        };
        rsQuery[type.name] = ctx;
        if (type.list) {
            var ctxForPlural = {
                type: new graphql_1.GraphQLList(ctx.type),
                description: type.listDescription,
                args: (0, createArgs_js_1["default"])(type.listArgs),
                resolve: typeof type.listResolve === 'function'
                    ? (function (_, args) {
                        return type.resolve(args);
                    })
                    : null
            };
            rsQuery[type.name + 's'] = ctxForPlural;
        }
        return rsQuery;
    }, {});
    return new graphql_1.GraphQLObjectType({
        name: isMutation ? 'Mutation' : 'Query',
        description: description,
        fields: fields
    });
};
var createSchema = function (_query, _mutation, description) {
    var ctx = {
        query: _query ? createRootType(_query, null, description.query) : null,
        mutation: _mutation
            ? createRootType(_mutation, { isMutation: true }, description.mutation)
            : null
    };
    return new graphql_1.GraphQLSchema(ctx);
};
var GraphqlOwO = /** @class */ (function () {
    function GraphqlOwO(_schema) {
        var _this = this;
        var THIS = Symbol('THIS');
        this[THIS] = {};
        var query = _schema.query, mutation = _schema.mutation, description = _schema.description;
        this[THIS].schema = createSchema(query, mutation, description);
        this.run = function (_query, _variables /* ← request variables */) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, graphql_1.graphql)({
                            schema: this[THIS].schema,
                            variableValues: _variables,
                            source: _query
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
    }
    return GraphqlOwO;
}());
exports["default"] = GraphqlOwO;
var graphiqlHTML = function (url) {
    var html = fs.readFileSync(path.resolve(__dirname, './static/graphiql.html'));
    return html.toString().replace('[[__req_url__]]', url || '/api/graphql');
};
exports.graphiqlHTML = graphiqlHTML;

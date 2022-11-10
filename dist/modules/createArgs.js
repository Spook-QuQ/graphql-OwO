"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const toPascal_1 = __importDefault(require("./toPascal"));
const objectTypeDetector_1 = __importDefault(require("./objectTypeDetector"));
const createArgs = (args) => {
    if (!args)
        return {};
    return Object.keys(args).reduce((rsArgs, argName) => {
        const targetArg = args[argName];
        const pascalName = (0, toPascal_1.default)(argName);
        let argType;
        if (Array.isArray(targetArg.type)) {
            if (!targetArg.type.length)
                throw new Error('Array length is 0 : ' + argName);
            const targetTypeObj = targetArg.type[0];
            if (typeof targetTypeObj === 'object') {
                const argTypeCtx = new graphql_1.GraphQLInputObjectType({
                    name: pascalName + 'InputType',
                    description: targetArg.description,
                    fields: createArgs(targetTypeObj),
                });
                const typeListed = new graphql_1.GraphQLList(argTypeCtx);
                argType = {
                    type: targetArg.nonNull ? new graphql_1.GraphQLNonNull(typeListed) : typeListed,
                };
            }
            else {
                argType = (0, objectTypeDetector_1.default)(targetTypeObj, {
                    matchWithTypeName: true,
                    nonNull: targetArg.nonNull,
                    isList: true,
                });
            }
        }
        else if (typeof targetArg.type === 'object') {
            const argTypeCtx = new graphql_1.GraphQLInputObjectType({
                name: pascalName + 'InputType',
                description: targetArg.description,
                fields: createArgs(targetArg.type),
            });
            argType = {
                type: targetArg.nonNull ? new graphql_1.GraphQLNonNull(argTypeCtx) : argTypeCtx,
            };
        }
        else {
            argType = (0, objectTypeDetector_1.default)(targetArg.type, {
                matchWithTypeName: true,
                nonNull: targetArg.nonNull,
            });
        }
        rsArgs[argName] = argType;
        return rsArgs;
    }, {});
};
exports.default = createArgs;

"use strict";
exports.__esModule = true;
var graphql_1 = require("graphql");
var toPascal_1 = require("./toPascal");
var objectTypeDetector_1 = require("./objectTypeDetector");
var createArgs = function (args) {
    if (!args)
        return {};
    return Object.keys(args).reduce(function (rsArgs, argName) {
        var targetArg = args[argName];
        var pascalName = (0, toPascal_1["default"])(argName);
        var argType;
        if (Array.isArray(targetArg.type)) {
            if (!targetArg.type.length)
                throw new Error('Array length is 0 : ' + argName);
            var targetTypeObj = targetArg.type[0];
            if (typeof targetTypeObj === 'object') {
                var argTypeCtx = new graphql_1.GraphQLInputObjectType({
                    name: pascalName + 'InputType',
                    description: targetArg.description,
                    fields: createArgs(targetTypeObj)
                });
                var typeListed = new graphql_1.GraphQLList(argTypeCtx);
                argType = {
                    type: targetArg.nonNull ? new graphql_1.GraphQLNonNull(typeListed) : typeListed
                };
            }
            else {
                argType = (0, objectTypeDetector_1["default"])(targetTypeObj, {
                    matchWithTypeName: true,
                    nonNull: targetArg.nonNull,
                    isList: true
                });
            }
        }
        else if (typeof targetArg.type === 'object') {
            var argTypeCtx = new graphql_1.GraphQLInputObjectType({
                name: pascalName + 'InputType',
                description: targetArg.description,
                fields: createArgs(targetArg.type)
            });
            argType = {
                type: targetArg.nonNull ? new graphql_1.GraphQLNonNull(argTypeCtx) : argTypeCtx
            };
        }
        else {
            argType = (0, objectTypeDetector_1["default"])(targetArg.type, {
                matchWithTypeName: true,
                nonNull: targetArg.nonNull
            });
        }
        rsArgs[argName] = argType;
        return rsArgs;
    }, {});
};
exports["default"] = createArgs;

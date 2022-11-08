"use strict";
exports.__esModule = true;
var graphql_1 = require("graphql");
var toPascal_js_1 = require("./toPascal.js");
var createFields_js_1 = require("./createFields.js");
var createType = function (name, data, description, option) {
    var _a = option || {}, matchWithTypeName = _a.matchWithTypeName, nonNull = _a.nonNull, idTypeOff = _a.idTypeOff;
    var pascalName = (0, toPascal_js_1["default"])(name);
    return new graphql_1.GraphQLObjectType({
        name: pascalName + 'Type',
        description: description,
        fields: (0, createFields_js_1["default"])(data, {
            useIDType: !idTypeOff,
            matchWithTypeName: matchWithTypeName,
            nonNull: nonNull
        })
    });
};
exports["default"] = createType;

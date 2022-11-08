"use strict";
exports.__esModule = true;
var graphql_1 = require("graphql");
var typeDetector = function (type) {
    var rs;
    switch (type.toLowerCase()) {
        case 'id':
            rs = graphql_1.GraphQLID;
            break;
        case 'string':
            rs = graphql_1.GraphQLString;
            break;
        case 'number':
            rs = graphql_1.GraphQLInt;
            break;
        case 'integer':
            rs = graphql_1.GraphQLInt;
            break;
        case 'int':
            rs = graphql_1.GraphQLInt;
            break;
        case 'float':
            rs = graphql_1.GraphQLFloat;
            break;
        case 'boolean':
            rs = graphql_1.GraphQLBoolean;
            break;
    }
    return rs;
};
var objectTypeDetector = function (val, option) {
    var _a = option || {}, matchWithTypeName = _a.matchWithTypeName, nonNull = _a.nonNull, isList = _a.isList;
    var type;
    if (matchWithTypeName)
        type = val;
    else
        type = typeof val;
    var rsType = typeDetector(type.toLowerCase());
    var typeCtx = isList ? new graphql_1.GraphQLList(rsType) : rsType;
    var typeCtx_ = nonNull ? new graphql_1.GraphQLNonNull(typeCtx) : typeCtx;
    return { type: typeCtx_ };
};
exports["default"] = objectTypeDetector;

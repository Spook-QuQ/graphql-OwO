"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const typeDetector = (type) => {
    let rs;
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
const objectTypeDetector = (val, option) => {
    const { matchWithTypeName, nonNull, isList } = option || {};
    let type;
    if (matchWithTypeName)
        type = val;
    else
        type = typeof val;
    const rsType = typeDetector(type.toLowerCase());
    const typeCtx = isList ? new graphql_1.GraphQLList(rsType) : rsType;
    const typeCtx_ = nonNull ? new graphql_1.GraphQLNonNull(typeCtx) : typeCtx;
    return { type: typeCtx_ };
};
exports.default = objectTypeDetector;

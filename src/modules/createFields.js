"use strict";
exports.__esModule = true;
var graphql_1 = require("graphql");
var toPascal_js_1 = require("./toPascal.js");
var objectTypeDetector_js_1 = require("./objectTypeDetector.js");
var createFields = function (data, option) {
    var _a = option || {}, useIDType = _a.useIDType, matchWithTypeName = _a.matchWithTypeName;
    return Object.keys(data).reduce(function (prev, key) {
        var _a;
        if (Array.isArray(data[key])) {
            if (!data[key].length)
                throw new Error('Array length is 0');
            var rsName = void 0;
            if (key.match(/s$/))
                rsName = (0, toPascal_js_1["default"])(key).slice(0, -1);
            else
                rsName = (0, toPascal_js_1["default"])(key);
            var witchData = void 0;
            if (typeof data[key][0] === 'object')
                witchData = data[key][0];
            else
                witchData = (_a = {}, _a[rsName] = data[key][0], _a);
            var listType = new graphql_1.GraphQLList(new graphql_1.GraphQLObjectType({
                name: rsName + 'Type',
                fields: createFields(witchData, option)
            }));
            prev[key] = { type: listType };
            return prev;
        }
        if (typeof data[key] === 'object') {
            prev[key] = {
                type: new graphql_1.GraphQLObjectType({
                    name: (0, toPascal_js_1["default"])(key) + 'Type',
                    fields: createFields(data[key], option)
                })
            };
            return prev;
        }
        if (useIDType && key === "id")
            prev[key] = { type: graphql_1.GraphQLID };
        else
            prev[key] = (0, objectTypeDetector_js_1["default"])(data[key], { matchWithTypeName: matchWithTypeName });
        return prev;
    }, {});
};
exports["default"] = createFields;

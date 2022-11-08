"use strict";
exports.__esModule = true;
var index_1 = require("../index");
var testArgs = {
    from: { type: 'string' },
    to: { type: 'string', nonNull: true },
    text: { type: 'string', nonNull: true },
    testList: { type: [{ testKey: { type: ['string'], nonNull: true } }] },
    testList2: { type: ['string'], nonNull: true },
    test: {
        type: {
            a: {
                type: {
                    c: {
                        type: {
                            e: { type: 'int', nonNull: false }
                        },
                        nonNull: true
                    },
                    d: { type: 'string' }
                },
                nonNull: true
            },
            b: { type: 'string', nonNull: false }
        },
        nonNull: true
    }
};
var schema = {
    query: [
        {
            name: 'history',
            fields: {
                rs: 'string'
            },
            resolve: function () { return ({ rs: 'test!!!!' }); }
        },
    ],
    mutation: [
        {
            name: 'deleteHistory',
            description: '-',
            typeDescription: '- \n -',
            fields: {
                rs: 'string',
                test: {
                    item: 'string',
                    qty: 'number',
                    users: ['string'],
                    a: {
                        f: [{ name: 'string', id: 'int' }],
                        b: {
                            c: {
                                d: 'string',
                                e: ['int']
                            }
                        }
                    }
                }
            },
            resolve: function (_) { }
        },
        {
            name: 'translate',
            description: '-',
            typeDescription: '- \n -',
            fields: {
                rsText: 'string',
                rsWords: 'string',
                // splitedText: 'string'
                splitedRsText: 'string'
            },
            args: testArgs,
            resolve: function (args) { }
        },
    ],
    description: {
        query: 'Hello',
        mutation: 'World'
    }
};
var graphqlOwO = new index_1["default"](schema);
module.exports = { graphqlOwO: graphqlOwO, graphiqlHTML: index_1.graphiqlHTML };
// module.exports = async (req, res) => {
//   if (req.method == 'POST') {
//     const { query, variables } = req.body
//     graphqlOwO.run(query, variables).then((rs) => {
//       const data = rs.data
//       res.send({ data } || {})
//     })
//   }
// }

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importStar(require("../index"));
const schema = {
    query: [
        {
            name: 'history',
            fields: {
                rs: 'string',
            },
            resolver: () => ({ rs: 'test!!!!' }),
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
                                e: ['int'],
                            },
                        },
                    },
                },
            },
            resolver: (_) => { },
        },
        {
            name: 'translate',
            description: '-',
            typeDescription: '- \n -',
            fields: {
                rsText: 'string',
                rsWords: 'string',
                // splitedText: 'string'
                splitedRsText: 'string',
            },
            args: {
                from: { type: 'string' },
                to: { type: 'string', nonNull: true },
                text: { type: 'string', nonNull: true },
                testList: { type: [{ testKey: { type: ['string'], nonNull: true } }] },
                testList2: { type: ['string'], nonNull: true },
                test: {
                    type: {
                        a: {
                            type: {
                                d: { type: 'string' },
                                c: {
                                    type: { e: { type: 'int', nonNull: false } },
                                    nonNull: true,
                                },
                            },
                            nonNull: true,
                        },
                        b: { type: 'string', nonNull: false },
                    },
                    nonNull: true,
                },
            },
            resolver: (args) => { },
        },
    ],
    description: {
        query: 'Hello',
        mutation: 'World',
    },
};
const graphqlOwO = new index_1.default(schema);
module.exports = { graphqlOwO, graphiqlHTML: index_1.graphiqlHTML };
// module.exports = async (req, res) => {
//   if (req.method == 'POST') {
//     const { query, variables } = req.body
//     graphqlOwO.run(query, variables).then((rs) => {
//       const data = rs.data
//       res.send({ data } || {})
//     })
//   }
// }

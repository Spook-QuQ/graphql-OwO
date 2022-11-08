import GraphqlOwO, { Schema, QueryType, ArgumentField } from '../index'

const testArgs = {
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
              e: { type: 'int', nonNull: false },
            },
            nonNull: true,
          },
          d: { type: 'string' },
        },
        nonNull: true,
      },
      b: { type: 'string', nonNull: false },
    },
    nonNull: true,
  },
}

const schema: Schema = {
  query: [
    {
      name: 'history',
      fields: {
        rs: 'string',
      },
      resolve: () => {},
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
      resolve: (_) => {},
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
      args: testArgs as ArgumentField,
      resolve: (args) => {},
    },
  ],
  description: {
    query: 'Hello',
    mutation: 'World',
  },
}

const graphqlOwO = new GraphqlOwO(schema)

module.exports = async (req, res) => {
  if (req.method == 'POST') {
    const { query, variables } = req.body
    graphqlOwO.run(query, variables).then((rs) => {
      const data = rs.data
      res.send({ data } || {})
    })
  }
}

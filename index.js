const fs = require('fs')
const path = require('path')

const graphiqlHTML = fs.readFileSync(path.resolve(__dirname, './graphiql.html'))

const {
  graphql,
  // // buildSchema,
  GraphQLSchema,
  // //
  GraphQLObjectType,
  // GraphQLInputObjectType,
  // GraphQLInt,
  // GraphQLFloat,
  // GraphQLString,
  // GraphQLBoolean,
  // GraphQLID,
  // //
  // GraphQLList,
  // GraphQLNonNull,
  // //
  // printSchema
} = require('graphql')

const toPascal = require('./modules/toPascal.js')
const objectTypeDetector = require('./modules/objectTypeDetector.js')
const createFields = require('./modules/createFields.js')
const createType = require('./modules/createType.js')
// const createInputType = require('./modules/createInputType.js')
const createArgs = require('./modules/createArgs.js')

const createRootType = (types, option, description) => {
  const { mutation } = option || {}

  const fields = types.reduce((rsQuery, type) => {
    const ctx = {}
    ctx.type = createType(
      type.name,
      type.fields,
      type.typeDescription,
      {
        matchWithTypeName: true,
        idTypeOff: type.idTypeOff
      }
    )

    ctx.description = type.description

    if (Object.keys(type.args || {}).length) {
      ctx.args = createArgs(type.args)
    }

    if (typeof type.resolve === 'function') {
      ctx.resolve = (_, args) => {
        return type.resolve(args)
      }
    }

    rsQuery[type.name] = ctx

    if (type.list) {
      const ctxForPlural = {}

      ctxForPlural.type = new GraphQLList(ctx.type)
      ctxForPlural.description = type.listDescription
      ctxForPlural.args = createArgs(type.listArgs)

      if (typeof type.listResolve === 'function') {
        ctxForPlural.resolve = (_, args) => {
          return type.listResolve(args)
        }
      }

      rsQuery[type.name + 's'] = ctxForPlural
    }

    return rsQuery
  }, {})

  return new GraphQLObjectType({
    name: mutation ? 'Mutation' : 'Query',
    description,
    fields
  })
}

const createSchema = (_query, _mutation, description) => {
  const ctx = {}
  if (_query) {
    ctx.query = createRootType(_query, null, description.query)
  }
  if (_mutation) {
    ctx.mutation = createRootType(_mutation, { mutation: true }, description.mutation)
  }
  return new GraphQLSchema({
    query: ctx.query,
    mutation: ctx.mutation
  })
}

module.exports = {
    GraphqlOwO: class GraphqlOwO {
    constructor (_schema) {
      const THIS = Symbol('THIS')
      this[THIS] = {}

      const { query, mutation, description } = _schema

      this[THIS].schema = createSchema(query, mutation, description)

      this.run = async (_query, _variables /* ← request variables */) => {
        return await graphql(this[THIS].schema, _query, null, null, _variables)
      }
    }
  },
  graphiqlHTML (url) {
    return graphiqlHTML.toString().replace('[[__req_url__]]', url || '/api/graphql')
  }
}

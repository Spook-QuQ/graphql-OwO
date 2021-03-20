const fs = require('fs')
const path = require('path')

const graphiqlHTML = fs.readFileSync(path.resolve(__dirname, './graphiql.html'))

const {
  graphql,
  // buildSchema,
  GraphQLSchema,
  //
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLBoolean,
  GraphQLID,
  //
  GraphQLList,
  GraphQLNonNull,
  //
  printSchema
} = require('graphql')

const objectTypeDetector = (val, option) => {
  const { matchWithTypeName, nonNull } = option || {}

  let type
  if (matchWithTypeName) type = val
  else type = typeof val

  switch (type.toLowerCase()) {
    case 'id': return { type: nonNull ? new GraphQLNonNull(GraphQLID) : GraphQLID }
    case 'string': return { type: nonNull ? new GraphQLNonNull(GraphQLString) : GraphQLString }
    case 'number':
      if (matchWithTypeName) {
        return { type: nonNull ? new GraphQLNonNull(GraphQLString) : GraphQLString }
      }
      if (Number.isInteger(Number(val))) return { type: nonNull ? new GraphQLNonNull(GraphQLString) : GraphQLInt }
      else return { type: nonNull ? new GraphQLNonNull(GraphQLFloat) : GraphQLFloat }
    case 'integer':
      return { type: nonNull ? new GraphQLNonNull(GraphQLString) : GraphQLInt }
    case 'int':
      return { type: nonNull ? new GraphQLNonNull(GraphQLString) : GraphQLInt }
    case 'float':
      return { type: nonNull ? new GraphQLNonNull(GraphQLFloat) : GraphQLFloat }
    case 'boolean': return { type: nonNull ? new GraphQLNonNull(GraphQLBoolean) : GraphQLBoolean }
  }
}

const createFields = (data, option) => {
  const { useIDType, matchWithTypeName } = option || {}
  return Object.keys(data).reduce((prev, key) => {
    if (useIDType && key == "id") prev[key] = { type: GraphQLID }
    else prev[key] = objectTypeDetector(data[key], { matchWithTypeName })
    return prev
  }, {})
}

const createType = (name, data, description, option) => {
  const { matchWithTypeName, nonNull, idTypeOff } = option || {}

  const pascalName = name.slice(0, 1).toUpperCase() + name.slice(1)

  return new GraphQLObjectType({
    name: pascalName + 'Type',
    description,
    fields: createFields(data, {
      useIDType: !idTypeOff,
      matchWithTypeName,
      nonNull
    })
  })
}

// 多階層の場合は InputObjectType を使うという認識
const createInputType = (name, schema, description, option) => {
  const { matchWithTypeName, nonNull, idTypeOff } = option || {}

  const fields = Object.keys(schema).reduce((ctx, keyName) => {
    ctx[keyName] = objectTypeDetector(schema[keyName].type, {
      useIDType: !schema[keyName].nonNull,
      matchWithTypeName,
      nonNull
    })
    return ctx
  }, {})

  const pascalName = name.slice(0, 1).toUpperCase() + name.slice(1)

  return new GraphQLInputObjectType({
    name: pascalName + 'InputType',
    description,
    fields
  })
}

const createArgs = args => {
  if (!args) return {}
  return Object.keys(args).reduce((rsArgs, argName) => {
    const targetArg = args[argName]

    let argType
    if (typeof targetArg.type === 'object') {
      argType = {
        type: createInputType(
          argName,
          targetArg.type,
          targetArg.description,
          { matchWithTypeName: true }
        )
      }
    } else {
      argType = objectTypeDetector(targetArg.type, {
        matchWithTypeName: true,
        nonNull: targetArg.nonNull
      })
    }
    rsArgs[argName] = argType

    return rsArgs
  }, {})
}

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

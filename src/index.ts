const fs = require('fs')
const path = require('path')

import {
  graphql,
  // // buildSchema,
  GraphQLSchema,
  // //
  GraphQLObjectType,
  ExecutionResult,
  GraphQLList,
} from 'graphql'

import { SupportedTypes } from './modules/objectTypeDetector.js'
import createType, { Field } from './modules/createType.js'
import createArgs, { ArgumentsType } from './modules/createArgs.js'

export type ArgumentsField<T = any> = {
  [keyname: string]: {
    type:
      | SupportedTypes
      | Array<ArgumentsField | SupportedTypes>
      | ArgumentsField
    nonNull?: boolean
  }
}

type Resolver<T = any> = (args: T) => any
type ListResolver<T = any> = (args: T) => Array<any>

export type QueryType = {
  name?: string
  idTypeOff?: boolean
  description?: string
  typeDescription?: string
  fields: Field
  args?: ArgumentsField
  resolver: Resolver
  list?: boolean
  listDescription?: string
  listArgs?: ArgumentsField
  listResolver?: ListResolver
}

type Description = {
  query: string
  mutation: string
}

export type Schema = {
  query: QueryType[]
  mutation: QueryType[]
  description: Description
}

const createRootType = (
  types: QueryType[],
  option: { isMutation?: boolean },
  description: string,
) => {
  const { isMutation } = option || {}

  type Context = {
    type: GraphQLObjectType<any, any>
    description: string
    args: ArgumentsType
    resolver: Resolver<ArgumentsType>
  }

  type ContxtForPlural = {
    type: GraphQLList<GraphQLObjectType<any, any>>
    description: string
    args: ArgumentsType
    resolver: ListResolver<ArgumentsType>
  }

  type RsQueries = {
    [typeName: string]: Context | ContxtForPlural
  }

  const rsQueries: RsQueries = types.reduce((rsQuery, type: QueryType) => {
    const args = Object.keys(type.args || {}).length
      ? createArgs(type.args)
      : null
    const ctx = {
      type: createType(type.name, type.fields, type.typeDescription, {
        matchWithTypeName: true,
        idTypeOff: type.idTypeOff,
      }),
      description: type.description,
      args,
      resolve:
        typeof type.resolver === 'function'
          ? (((_, args) => {
              return type.resolver(args)
            }) as Resolver)
          : null,
    }

    rsQuery[type.name] = ctx

    if (type.list) {
      const ctxForPlural = {
        type: new GraphQLList(ctx.type),
        description: type.listDescription,
        args: createArgs(type.listArgs),
        resolve:
          typeof type.listResolver === 'function'
            ? (((_, args) => {
                return type.resolver(args)
              }) as ListResolver)
            : null,
      }

      rsQuery[type.name + 's'] = ctxForPlural
    }

    return rsQuery
  }, {})

  return new GraphQLObjectType({
    name: isMutation ? 'Mutation' : 'Query',
    description,
    fields: rsQueries,
  })
}

const createSchema = (
  _query: QueryType[],
  _mutation: QueryType[],
  description: Description,
) => {
  type Context = {
    query: GraphQLObjectType | null
    mutation: GraphQLObjectType | null
  }

  const ctx: Context = {
    query: _query ? createRootType(_query, null, description.query) : null,
    mutation: _mutation
      ? createRootType(_mutation, { isMutation: true }, description.mutation)
      : null,
  }

  return new GraphQLSchema(ctx)
}

export default class GraphqlOwO {
  run: (_query: any, _variables: any) => Promise<any>

  constructor(_schema: Schema) {
    const THIS = Symbol('THIS')
    this[THIS] = {}

    const { query, mutation, description } = _schema

    this[THIS].schema = createSchema(query, mutation, description)

    this.run = async (_query, _variables /* ← request variables */) => {
      return await graphql({
        schema: this[THIS].schema,
        variableValues: _variables,
        source: _query,
      })
    }
  }
}

export const graphiqlHTML = (url) => {
  const html = fs.readFileSync(
    path.resolve(__dirname, './static/graphiql.html'),
  )
  return html.toString().replace('[[__req_url__]]', url || '/api/graphql')
}

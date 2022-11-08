import fs from 'fs'
import path from 'path'

import {
  graphql,
  // // buildSchema,
  GraphQLSchema,
  // //
  GraphQLObjectType,
  ExecutionResult,
  GraphQLList,
} from 'graphql'

import toPascal from './modules/toPascal.js'
import objectTypeDetector, {
  SupportedTypes,
} from './modules/objectTypeDetector.js'
import createFields from './modules/createFields.js'
import createType from './modules/createType.js'
// const createInputType = require('./modules/createInputType.js')
import createArgs, { ArgumentsType } from './modules/createArgs.js'
import { ObjMap } from 'graphql/jsutils/ObjMap.js'

type Field =
  | SupportedTypes
  | Array<SupportedTypes>
  | Array<Field>
  | { [keyname: string]: Field }

export type ArgumentField = {
  [keyname: string]: {
    type: SupportedTypes | Array<ArgumentField | SupportedTypes> | ArgumentField
    nonNull?: boolean
  }
}

type Resolver<T = any> = (args: T) => any
type ListResolver<T = any> = (args: T) => Array<any>

export type QueryType<> = {
  name?: string
  idTypeOff?: boolean
  description?: string
  typeDescription?: string
  fields: Field
  args?: ArgumentField
  resolve: Resolver // 🍄
  list?: boolean
  listDescription?: string
  listArgs?: ArgumentField
  listResolve?: ListResolver
}

type QueryRoot = QueryType[]

type Description = {
  query: string
  mutation: string
}

export type Schema = {
  query: QueryRoot
  mutation: QueryRoot
  description: Description
}

type ContextOfCreateRootType = {
  type: GraphQLObjectType<any, any>
  description: string
  args: ArgumentsType
  resolve: Resolver<ArgumentsType>
}

type ContxtForPluralOfCreateRootType = {
  type: GraphQLList<GraphQLObjectType<any, any>>
  description: string
  args: ArgumentsType
  resolve: ListResolver<ArgumentsType>
}

const createRootType = (
  types: QueryRoot,
  option: { isMutation?: boolean },
  description: string,
) => {
  const { isMutation } = option || {}

  const fields: {
    [name: string]: ContextOfCreateRootType | ContxtForPluralOfCreateRootType
  } = types.reduce((rsQuery, type) => {
    // type Context = {
    //   type?: any
    //   description?: any
    //   args?: ArgumentsType
    //   resolve?: any
    // } // 🍄

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
        typeof type.resolve === 'function'
          ? (((_, args) => {
              return type.resolve(args)
            }) as Resolver<typeof args>)
          : null,
    }

    rsQuery[type.name] = ctx as ContextOfCreateRootType

    if (type.list) {
      const ctxForPlural = {
        type: new GraphQLList(ctx.type),
        description: type.listDescription,
        args: createArgs(type.listArgs),
        resolve:
          typeof type.listResolve === 'function'
            ? (((_, args) => {
                return type.resolve(args)
              }) as ListResolver<typeof args>)
            : null,
      }

      rsQuery[type.name + 's'] = ctxForPlural as ContxtForPluralOfCreateRootType
    }

    return rsQuery
  }, {})

  return new GraphQLObjectType({
    name: isMutation ? 'Mutation' : 'Query',
    description,
    fields,
  })
}

const createSchema = (
  _query: QueryRoot,
  _mutation: QueryRoot,
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
  run: (
    _query: any,
    _variables: any,
  ) => Promise<ExecutionResult<ObjMap<unknown>, ObjMap<unknown>>>

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

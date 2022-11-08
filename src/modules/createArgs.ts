import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLScalarType,
  TypeInfo,
} from 'graphql'

import toPascal from './toPascal'
import objectTypeDetector from './objectTypeDetector'

type ArgumentType =
  | GraphQLInputObjectType
  | GraphQLList<GraphQLInputObjectType>
  | GraphQLNonNull<GraphQLList<GraphQLInputObjectType>>
  | GraphQLNonNull<GraphQLInputObjectType>
  | (
      | GraphQLScalarType<string, string>
      | GraphQLScalarType<number, number>
      | GraphQLScalarType<boolean, boolean>
    )
  | GraphQLNonNull<
      | (
          | GraphQLScalarType<string, string>
          | GraphQLScalarType<number, number>
          | GraphQLScalarType<boolean, boolean>
        )
      | GraphQLList<
          | GraphQLScalarType<string, string>
          | GraphQLScalarType<number, number>
          | GraphQLScalarType<boolean, boolean>
        >
    >

export type ArgumentsType = {
  [x: string]: { type: ArgumentType }
}

const createArgs = (args: {
  [x: string]: any
}): ArgumentsType => {
  if (!args) return {}
  return Object.keys(args).reduce((rsArgs, argName) => {
    const targetArg = args[argName]
    const pascalName = toPascal(argName)

    let argType: {
      type: ArgumentType
    }

    if (Array.isArray(targetArg.type)) {
      if (!targetArg.type.length)
        throw new Error('Array length is 0 : ' + argName)
      const targetTypeObj = targetArg.type[0]
      if (typeof targetTypeObj === 'object') {
        const argTypeCtx = new GraphQLInputObjectType({
          name: pascalName + 'InputType',
          description: targetArg.description,
          fields: createArgs(targetTypeObj),
        })
        const typeListed = new GraphQLList(argTypeCtx)
        argType = {
          type: targetArg.nonNull ? new GraphQLNonNull(typeListed) : typeListed,
        }
      } else {
        argType = objectTypeDetector(targetTypeObj, {
          matchWithTypeName: true,
          nonNull: targetArg.nonNull,
          isList: true,
        })
      }
    } else if (typeof targetArg.type === 'object') {
      const argTypeCtx = new GraphQLInputObjectType({
        name: pascalName + 'InputType',
        description: targetArg.description,
        fields: createArgs(targetArg.type),
      })
      argType = {
        type: targetArg.nonNull ? new GraphQLNonNull(argTypeCtx) : argTypeCtx,
      }
    } else {
      argType = objectTypeDetector(targetArg.type, {
        matchWithTypeName: true,
        nonNull: targetArg.nonNull,
      })
    }
    rsArgs[argName] = argType

    return rsArgs
  }, {})
}

export default createArgs

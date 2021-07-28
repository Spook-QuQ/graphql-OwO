const {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLList
} = require('graphql')

const toPascal = require('./toPascal.js')
const objectTypeDetector = require('./objectTypeDetector.js')

const createArgs = args => {
  if (!args) return {}
  return Object.keys(args).reduce((rsArgs, argName) => {
    const targetArg = args[argName]
    const pascalName = toPascal(argName)

    let argType

    if (Array.isArray(targetArg.type)) {
      if (!targetArg.type.length) throw new Error('Array length is 0 : ' + argName)
      const targetTypeObj = targetArg.type[0]
      if (typeof targetTypeObj === 'object') {
        const argTypeCtx = new GraphQLInputObjectType({
          name: pascalName + 'InputType',
          description: targetArg.description,
          fields: createArgs(targetTypeObj)
        })
        const typeListed = new GraphQLList(argTypeCtx)
        argType = {
          type: targetArg.nonNull ? new GraphQLNonNull(typeListed) : typeListed
        }
      } else {
        argType = objectTypeDetector(targetTypeObj, {
          matchWithTypeName: true,
          nonNull: targetArg.nonNull,
          isList: true
        })
      }
    } else if (typeof targetArg.type === 'object') {
      // const argTypeCtx = createInputType(
      //   argName,
      //   targetArg.type,
      //   targetArg.description,
      //   { matchWithTypeName: true, nonNull: targetArg.nonNull }
      // )
      const argTypeCtx = new GraphQLInputObjectType({
        name: pascalName + 'InputType',
        description: targetArg.description,
        fields: createArgs(targetArg.type)
      })
      argType = {
        type: targetArg.nonNull ? new GraphQLNonNull(argTypeCtx) : argTypeCtx
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

module.exports = createArgs

const {
  GraphQLObjectType
} = require('graphql')

const toPascal = require('./toPascal.js')
const createFields = require('./createFields.js')

const createType = (name, data, description, option) => {
  const { matchWithTypeName, nonNull, idTypeOff } = option || {}

  const pascalName = toPascal(name)

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

module.exports = createType

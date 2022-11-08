import { GraphQLObjectType } from 'graphql'

import toPascal from './toPascal.js'
import createFields from './createFields.js'

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

export default createType

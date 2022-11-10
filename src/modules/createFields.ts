import { GraphQLObjectType, GraphQLID, GraphQLList } from 'graphql'

import toPascal from './toPascal.js'
import objectTypeDetector, { SupportedTypes } from './objectTypeDetector.js'
import { Field } from './createType.js'

const createFields = (
  data: Field | Field[],
  // data: any,
  option: {
    useIDType?: boolean
    matchWithTypeName?: boolean | undefined
    nonNull?: boolean | undefined
  },
) => {
  const { useIDType, matchWithTypeName } = option || {}

  return Object.keys(data).reduce((prev, key) => {

    if (typeof data === 'string') {
      if (useIDType && key === 'id') prev[key] = { type: GraphQLID }
      else prev[key] = objectTypeDetector(data[key], { matchWithTypeName })
    }

    if (Array.isArray(data[key])) {
      if (!data[key].length) throw new Error('Array length is 0')

      let rsName
      if (key.match(/s$/)) rsName = toPascal(key).slice(0, -1)
      else rsName = toPascal(key)

      let whichData
      if (typeof data[key][0] === 'object') whichData = data[key][0]
      else whichData = { [rsName]: data[key][0] }

      const listType = new GraphQLList(
        new GraphQLObjectType({
          name: rsName + 'Type',
          fields: createFields(whichData, option),
        }),
      )

      prev[key] = { type: listType }

      return prev
    }

    if (typeof data[key] === 'object') {
      prev[key] = {
        type: new GraphQLObjectType({
          name: toPascal(key) + 'Type',
          fields: createFields(data[key], option),
        }),
      }
      return prev
    }

    return prev
  }, {} as { [x: string]: any })
}

export default createFields

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
} = require('graphql')

const toPascal = require('./toPascal.js')
const objectTypeDetector = require('./objectTypeDetector.js')

const createFields = (data, option) => {
  const { useIDType, matchWithTypeName } = option || {}

  return Object.keys(data).reduce((prev, key) => {

    if (Array.isArray(data[key])) {
      if (!data[key].length) throw new Error('Array length is 0')

      let rsName
      if (key.match(/s$/)) rsName = toPascal(key).slice(0, -1)
      else rsName = toPascal(key)

      let witchData
      if (typeof data[key][0] === 'object') witchData = data[key][0]
      else witchData = { [rsName]: data[key][0] }

      const listType = new GraphQLList(new GraphQLObjectType({
        name: rsName + 'Type',
        fields: createFields(witchData, option)
      }))

      prev[key] = { type: listType }

      return prev
    }

    if (typeof data[key] === 'object') {
      prev[key] = {
        type: new GraphQLObjectType({
          name: toPascal(key) + 'Type',
          fields: createFields(data[key], option)
        })
      }
      return prev
    }

    if (useIDType && key === "id") prev[key] = { type: GraphQLID }
    else prev[key] = objectTypeDetector(data[key], { matchWithTypeName })
    return prev
  }, {})
}

module.exports = createFields

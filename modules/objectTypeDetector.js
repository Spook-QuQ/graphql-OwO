const {
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList
} = require('graphql')

// const objectTypeDetector = (val, option) => {
//   const { matchWithTypeName, nonNull } = option || {}
//
//   let type
//   if (matchWithTypeName) type = val
//   else type = typeof val
//
//   switch (type.toLowerCase()) {
//     case 'id': return { type: nonNull ? new GraphQLNonNull(GraphQLID) : GraphQLID }
//     case 'string': return { type: nonNull ? new GraphQLNonNull(GraphQLString) : GraphQLString }
//     case 'number':
//       if (matchWithTypeName) {
//         return { type: nonNull ? new GraphQLNonNull(GraphQLString) : GraphQLString }
//       }
//       if (Number.isInteger(Number(val))) return { type: nonNull ? new GraphQLNonNull(GraphQLString) : GraphQLInt }
//       else return { type: nonNull ? new GraphQLNonNull(GraphQLFloat) : GraphQLFloat }
//     case 'integer':
//       return { type: nonNull ? new GraphQLNonNull(GraphQLString) : GraphQLInt }
//     case 'int':
//       return { type: nonNull ? new GraphQLNonNull(GraphQLString) : GraphQLInt }
//     case 'float':
//       return { type: nonNull ? new GraphQLNonNull(GraphQLFloat) : GraphQLFloat }
//     case 'boolean': return { type: nonNull ? new GraphQLNonNull(GraphQLBoolean) : GraphQLBoolean }
//   }
// }

const typeDetector = type => {
  let rs
  switch (type.toLowerCase()) {
    case 'id': rs = GraphQLID
      break
    case 'string': rs = GraphQLString
      break
    case 'number': rs = GraphQLInt
      break
    case 'integer': rs = GraphQLInt
      break
    case 'int': rs = GraphQLInt
      break
    case 'float': rs = GraphQLFloat
      break
    case 'boolean': rs = GraphQLBoolean
      break
  }
  return rs
}

const objectTypeDetector = (val, option) => {
  const { matchWithTypeName, nonNull, isList } = option || {}

  let type
  if (matchWithTypeName) type = val
  else type = typeof val

  const rsType = typeDetector(type.toLowerCase())

  const typeCtx =
    isList ?
      new GraphQLList(rsType)
    :
      rsType

  const typeCtx_ =
    nonNull ?
      new GraphQLNonNull(typeCtx)
    :
      typeCtx

  return { type: typeCtx_ }
}

module.exports = objectTypeDetector

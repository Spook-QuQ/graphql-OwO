import {
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList,
  GraphQLScalarType,
} from 'graphql'

export type SupportedTypes =
  | 'id'
  | 'string'
  | 'number'
  | 'integer'
  | 'int'
  | 'float'
  | 'boolean'

type ResultOfTypeDetector =
  | GraphQLScalarType<string, string>
  | GraphQLScalarType<number, number>
  | GraphQLScalarType<boolean, boolean>

const typeDetector = (type: string) => {
  let rs: ResultOfTypeDetector
  switch (type.toLowerCase() as SupportedTypes) {
    case 'id':
      rs = GraphQLID
      break
    case 'string':
      rs = GraphQLString
      break
    case 'number':
      rs = GraphQLInt
      break
    case 'integer':
      rs = GraphQLInt
      break
    case 'int':
      rs = GraphQLInt
      break
    case 'float':
      rs = GraphQLFloat
      break
    case 'boolean':
      rs = GraphQLBoolean
      break
  }
  return rs as ResultOfTypeDetector
}

const objectTypeDetector = (
  val: any,
  option: { matchWithTypeName?: boolean; nonNull?: boolean; isList?: boolean },
) => {
  const { matchWithTypeName, nonNull, isList } = option || {}

  let type: string
  if (matchWithTypeName) type = val
  else type = typeof val

  const rsType = typeDetector(type.toLowerCase())

  const typeCtx: GraphQLList<ResultOfTypeDetector> | ResultOfTypeDetector =
    isList ? new GraphQLList(rsType) : rsType

  const typeCtx_:
    | GraphQLNonNull<GraphQLList<ResultOfTypeDetector> | ResultOfTypeDetector>
    | ResultOfTypeDetector = nonNull ? new GraphQLNonNull(typeCtx) : typeCtx

  return { type: typeCtx_ }
}

export default objectTypeDetector

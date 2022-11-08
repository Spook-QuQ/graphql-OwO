import { GraphQLObjectType } from 'graphql'

import toPascal from './toPascal.js'
import createFields from './createFields.js'

import {
  SupportedTypes,
} from './objectTypeDetector.js'

export type Field =
  | SupportedTypes
  | Array<SupportedTypes>
  | Array<Field>
  | { [keyname: string]: Field }

const createType = (
  name: string,
  data: Field,
  description: string,
  option: {
    matchWithTypeName?: boolean
    nonNull?: boolean
    idTypeOff?: boolean
  },
) => {
  const { matchWithTypeName, nonNull, idTypeOff } = option || {}

  const pascalName = toPascal(name)

  return new GraphQLObjectType({
    name: pascalName + 'Type',
    description,
    fields: createFields(data, {
      useIDType: !idTypeOff,
      matchWithTypeName,
      nonNull,
    }),
  })
}

export default createType

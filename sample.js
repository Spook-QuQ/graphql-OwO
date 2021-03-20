// this[THIS].schema = createSchema(querySample, mutationType, rootDescription)

const rootDescription = {
  query: 'hello',
  mutation: 'world'
}

const querySample = [
  {
    name: 'user',
    idTypeOff: true,
    fields: {
      id: 'ID',
      text: 'String',
      flag: 'Boolean'
    },
    args: {
      id: {
        type: 'string',
        nonNull: true
      },
      uid: {
        type: 'Number',
      }
    },
    resolve: args => {
      // return args.uid + ' test ' + args.id
      return { id: '1', text: 'text', flag: true }
    },
    list: true,
    listArgs: {
      filter: {
        type: 'number'
      }
    },
    listResolve: args => {
      return [{ id: 1, text: 'text', flag: true }]
    },
    description: 'This is The Test Type.',
    typeDescription: 'This is The Type of This Test',
    listDescription: 'This is The description of own Lists'
  }
]

const mutationType = [
  {
    name: 'createMessage',
    description: 'ok daze.',
    fields: {
      id: 'Integer',
      text: 'string',
      flag: 'boolean'
    },
    args: {
      id: {
        type: 'string',
        nonNull: true
      },
      uid: {
        type: 'number',
      }
    },
    resolve: args => {
      return args.uid + ' test ' + args.id
    }
  }
]

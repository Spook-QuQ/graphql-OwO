// npm i express

const { graphqlOwO, graphiqlHTML } = require('../src/sample/v1')

// const url = 'http://localhost:3000'

// console.log(graphqlOwO);

const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/api/graphql', async (req, res) => {
  if (!req.body) return res.send({})
  const { query, variables } = req.body

  const data = await graphqlOwO.run(query, variables)
  res.send(data || {})
})

// respond with "hello world" when a GET request is made to the homepage
app.get('/api/graphiql', (req, res) => {
  res.send(graphiqlHTML())
})

app.listen(3000)

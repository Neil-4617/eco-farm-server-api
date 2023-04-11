// Declare dependencies
import express from'express'
import {graphqlHTTP} from'express-graphql'
import mongoose from'mongoose'
import cors from'cors'
import dotenv from'dotenv'
import bodyParser from'body-parser'

// Schema
// import graphqlSchema from'./gql-schema'
import {schema} from'./gql-schema/schema.js'

// env
dotenv.config()

// initialized express
const app = express()

// Database connection
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.once('open', ()=>{
	console.log("MongoDB Connected!")
})

// middleware
app.use(cors())
app.use(bodyParser.json({limit: '15mb'}))
app.use('/graphql', graphqlHTTP({ schema, graphiql: true}))

// Serve Static folder
app.use('/images', express.static('images'))


const port = process.env.PORT || 4001

app.listen(port, ()=>{
	console.log(`🚀 CORS-enabled, Now web server listening on port ${port}`)
})
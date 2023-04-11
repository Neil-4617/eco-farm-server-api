// GraphQL dependencies
import {GraphQLSchema} from 'graphql'

import {RootQuery} from './queries.js'
import {Mutation} from './mutations.js'

// Schema export
export const schema = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
})
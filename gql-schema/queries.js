// GraphQL dependencies
import {
	GraphQLObjectType,
	GraphQLID,
	GraphQLString,
	GraphQLList,
	GraphQLSchema,
	GraphQLNonNull
} from 'graphql'

// GraphQL Type Definition
import {UserType, UnitType, BookEntryType} from './typeDef.js'

// custom scalar
import {GraphqlDateTimeCustom} from './datetime.js'

// Mongoose models
import { User } from '../models/User.js'
import { Unit } from '../models/Unit.js'
import { BookEntry } from '../models/BookEntry.js'


// Query declaration and export
export const RootQuery = new GraphQLObjectType({
	name: 'RootQuery',
	description: 'Represents a query to collection',
	fields: {
		currentDate: {
			type: GraphqlDateTimeCustom,
			resolve(){
				return new Date()
			}
		},

		/*to retrieve all users*/
		users: {
			type: new GraphQLList(UserType),
			resolve: ()=>{
				return User.find({})
			}
		},
		/*to retrieve a single user*/
		user: {
			type: UserType,
			args: {
				id: {type: GraphQLID}
			},
			resolve: (parent, args) => {
				return User.findById(args.id)
			}
		},

		units: {
			type: new GraphQLList(UnitType),
			resolve: (parent, args) => {
				return Unit.find({})
			}
		},

		unit: {
			type: UnitType,
			args: {
				id: {type: GraphQLID}
			},
			resolve: (parent, args) => {
				return Unit.findById(args.id)
			}
		},

		bookEntries: {
			type: new GraphQLList(BookEntryType),
			resolve: (parent, args)=>{
				return BookEntry.find({})
			}
		},

		bookEntry: {
			type: BookEntryType,
			args: {
				id: {type: GraphQLID}
			},
			resolve: (parent, args) => {
				return BookEntry.findById(args.id)
			}
		},

		bookEntriesByUser: {
			type: new GraphQLList(BookEntryType),
			args: {
				id: {type: GraphQLID}
			},
			resolve: (parent, args) => {
				const bookedByUser = BookEntry.find({ userId: args.id})
				return bookedByUser
			}
		},
		
	}
})
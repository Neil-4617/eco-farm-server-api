// GraphQL dependencies
import {
	GraphQLObjectType,
	GraphQLID,
	GraphQLString,
	GraphQLList,
	GraphQLNonNull
} from 'graphql'

// graphql custom scalar
import {GraphqlDateTimeCustom} from './datetime.js'

// mongoose model
import { BookEntry } from '../models/BookEntry.js'
import { Unit } from '../models/Unit.js'
import { User } from '../models/User.js'

// User type
export const UserType = new GraphQLObjectType({
	name : 'User',
	description: 'This represent a User',
	fields: () => ({
		id : {type: GraphQLID},
		firstname : {type: GraphQLString},
		lastname : {type: GraphQLString},
		email : {type: GraphQLString},
		password : {type: GraphQLString},
		role : {type: GraphQLString},
		mobile : {type: GraphQLString},
		token : {type: GraphQLString},
		createdAt : {type: GraphqlDateTimeCustom},
		updatedAt : {type: GraphqlDateTimeCustom},
		bookEntries : {
			type : new GraphQLList(BookEntryType),
			resolve: (parent, args) => {
				return BookEntry.find({userId: parent.id})
			}
		}
	})
})
// Unit type
export const UnitType = new GraphQLObjectType ({
	name: 'Unit',
	description: 'This represent a Unit',
	fields: ()=> ({
		id: {type: GraphQLID},
		name: {type: GraphQLString},
		description: {type: GraphQLString},
		rate: {type: GraphQLString},
		capacity: {type: GraphQLString},
		unitAvail: {type: GraphQLString},
		imgPath: {type: GraphQLString},
		createdAt: {type: GraphqlDateTimeCustom},
		updatedAt: {type: GraphqlDateTimeCustom},
		bookEntries : {
			type : new GraphQLList(BookEntryType),
			resolve: (parent, args) => {
				return BookEntry.find({unitId: parent.id})
			}
		}
	})
})
// BookEntry type
export const BookEntryType = new GraphQLObjectType({
	name: 'BookEntry',
	description: 'This represent a BookEntry',
	fields: ()=>({
		id: {type: GraphQLID},
		checkIn: {type: GraphQLString},
		checkOut: {type: GraphQLString},
		status: {type: GraphQLString},
		userId: {type: GraphQLString},
		unitId: {type: GraphQLString},
		paymentOpt: {type: GraphQLString},
		createdAt: {type: GraphqlDateTimeCustom},
		updatedAt: {type: GraphqlDateTimeCustom},
		unit:{
			type: UnitType,
			resolve: (parent, args) => {
				return Unit.findById(parent.unitId)
			}
		},
		user:{
			type: UserType,
			resolve: (parent, args) => {
				return User.findById(parent.userId)
			}
		},
	})
})

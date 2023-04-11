// Base64 Dependencies
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'

import bcrypt from 'bcrypt'
import {createToken, verifyToken} from '../jwtAuth.js'

// GraphQL dependencies
import {
	GraphQLID,
	GraphQLString,
	GraphQLNonNull,
	GraphQLList,
	GraphQLObjectType
} from 'graphql'

// GraphQL Type Definition
import {UserType, UnitType, BookEntryType} from './typeDef.js'

// Mongoose models
import { Unit } from '../models/Unit.js'
import { User } from '../models/User.js'
import { BookEntry } from '../models/BookEntry.js'

export const Mutation = new GraphQLObjectType ({
	name: 'Mutation',
	fields: {
		addUser:{
			type: UserType,
			description: 'Add user with a default role value',
			args: {
				firstname: {type: new GraphQLNonNull(GraphQLString)},
				lastname: {type: new GraphQLNonNull(GraphQLString)},
				email: {type: new GraphQLNonNull(GraphQLString)},
				password: {type: new GraphQLNonNull(GraphQLString)}, 
				mobile: {type: new GraphQLNonNull(GraphQLString)}
			}, 
			resolve: (parent, args) => {
				let newUser = new User({
					firstname: args.firstname,
					lastname: args.lastname,
			 		email: args.email,
			 		password: bcrypt.hashSync(args.password, 10),
			 		mobile: args.mobile,
			 		role: "0"
				})
				return newUser.save().then((user,err) =>{
					return (err) ? false : true
				})
			}
		},

		updateUser: {
			type: UserType,
			description: 'Update User',
			args: {
				id: {type: new GraphQLNonNull(GraphQLID)},
				firstname: {type: new GraphQLNonNull(GraphQLString)},
				lastname: {type: new GraphQLNonNull(GraphQLString)},
				email: {type: new GraphQLNonNull(GraphQLString)},
				gender: {type: new GraphQLNonNull(GraphQLString)},
				username: {type: new GraphQLNonNull(GraphQLString)},
				password: {type: new GraphQLNonNull(GraphQLString)}, 
				mobile: {type: new GraphQLNonNull(GraphQLString)}
			},
			resolve: (parent, args)=>{
				let userId = { _id: args.id}
				let updates = {
					firstname: args.firstname,
					lastname: args.lastname,
			 		email: args.email,
			 		gender: args.gender,
			 		username: args.username,
			 		password: args.password,
			 		mobile: args.mobile
				}
				return User.findOneAndUpdate(userId, updates)
			} 
		},

		deleteUser: {
			type: UserType,
			args: {
				id: {type: new GraphQLNonNull(GraphQLID)}
			},
			resolve: (parent, args)=> {
				let userId = {_id: args.id}
				return User.findOneAndDelete(userId)
			}
		},

		login: {
			type: UserType,
			description: 'Authenticate User and create a token',
			args: {
				email: {type: new GraphQLNonNull(GraphQLString)},
				password: {type: new GraphQLNonNull(GraphQLString)}
			},
			resolve: (parent, args) => {
				let query = User.findOne({email: args.email})
				
				return query.then((user) => user).then((user)=> {
					if (user == null) { return null }

						let isPasswordMatched = bcrypt.compareSync(args.password, user.password)

						if (isPasswordMatched) {
							user.token = createToken(user.toObject())
							return user
						} else {
							return null
						}
				})
			}
		},


		addUnit: {
			type: UnitType,
			description: 'Authorized user can add unit',
			args: {
				name: {type: new GraphQLNonNull(GraphQLString)},
				description: {type: new GraphQLNonNull(GraphQLString)},
				rate: {type: new GraphQLNonNull(GraphQLString)},
				capacity: {type: new GraphQLNonNull(GraphQLString)},
				unitAvail: {type: new GraphQLNonNull(GraphQLString)},
				base64EncodedImage: {type: new GraphQLNonNull(GraphQLString)},
			},
			resolve: (parent, args) => {
				let base64String = args.base64EncodedImage
				let base64Image = base64String.split(';base64,').pop()
				let imgPath = 'images/' + uuidv4() + '.png'

				fs.writeFile(imgPath, base64Image, {encoding: 'base64'}, (err)=>{})

				let unit = new Unit({
					name: args.name,
					description: args.description,
					rate: args.rate,
					capacity: args.capacity,
					unitAvail: args.unitAvail,
					imgPath: imgPath
				})
				return unit.save()
			}
		},

		updateUnit: {
			type: UnitType,
			description: 'Authorized user can modify or update unit',
			args: {
				id: {type: new GraphQLNonNull(GraphQLID)},
				name: {type: new GraphQLNonNull(GraphQLString)},
				description: {type: new GraphQLNonNull(GraphQLString)},
				rate: {type: new GraphQLNonNull(GraphQLString)},
				capacity: {type: new GraphQLNonNull(GraphQLString)},
				unitAvail: {type: new GraphQLNonNull(GraphQLString)},
				base64EncodedImage: {type: new GraphQLNonNull(GraphQLString)}
			},
			resolve: (parent, args)=>{
				let base64String = args.base64EncodedImage
				let base64Image = base64String.split(';base64,').pop()
				let imgPath = 'images/' + uuidv4() + '.png'

				fs.writeFile(imgPath, base64Image, {encoding: 'base64'}, (err)=>{})

				let unitId = {_id: args.id}
				let updates = {
					name: args.name,
					description: args.description,
					rate: args.rate,
					capacity: args.capacity,
					unitAvail: args.unitAvail,
					imgPath: imgPath
				}
				return Unit.findOneAndUpdate(unitId, updates)
			}
		},

		deleteUnit: {
			type: UnitType,
			description: 'Authorized user can delete unit from collection',
			args: {
				id: {type: new GraphQLNonNull(GraphQLID)}
			},
			resolve: (parent, args) => {
				let unitId = {_id: args.id}
				return Unit.findByIdAndRemove(unitId)
			}
		},

		
		addBookEntry: {
			type: BookEntryType,
			description: 'User can add book entry',
			args: {
				userId: {type: new GraphQLNonNull(GraphQLString)},
				unitId: {type: new GraphQLNonNull(GraphQLString)},
				checkIn: {type: new GraphQLNonNull(GraphQLString)},
				checkOut: {type: new GraphQLNonNull(GraphQLString)},
				status: {type: new GraphQLNonNull(GraphQLString)},
				paymentOpt: {type: new GraphQLNonNull(GraphQLString)},
				token: {type: new GraphQLNonNull(GraphQLString)}
			},
			resolve: (parent, args) => {
				const userToken = verifyToken(args.token)

				if (userToken) {
					let userId = {_id: args.userId}
					let unitId = {_id: args.unitId}
					let newBookEntry = new BookEntry({
						unitId: unitId,
						userId: userId,
						checkIn: args.checkIn,
						checkOut: args.checkOut,
						status: args.status,
						paymentOpt: args.paymentOpt
					})
					return newBookEntry.save()
				}
				else {
					return null
				}
			}
		},

		updateBookEntry: {
			type: BookEntryType,
			description: 'Authorized user can update book entry',
			args: {
				userId: {type: new GraphQLNonNull(GraphQLString)},
				unitId: {type: new GraphQLNonNull(GraphQLString)},
				checkIn: {type: new GraphQLNonNull(GraphQLString)},
				checkOut: {type: new GraphQLNonNull(GraphQLString)},
				status: {type: new GraphQLNonNull(GraphQLString)},
				paymentOpt: {type: new GraphQLNonNull(GraphQLString)}
			},
			resolve: (parent,args)=>{
				let userId = {_id: args.userId}
				let unitId = {_id: args.unitId}
				let bookEntryId = {_id: args.id}
				let updates = {
					checkIn: userId,
					checkIn: unitId,
					checkIn: args.checkIn,
					checkOut: args.checkOut,
					status: args.status,
					paymentOpt: args.paymentOpt
				}
				return BookEntry.findOneAndUpdate(bookEntryId, update)
			}
		},

		deleteBookEntry: {
			type: BookEntryType,
			description: 'Authorized user can delete book entry from collection',
			args: {
				id: {type: new GraphQLNonNull(GraphQLID)}
			},
			resolve: (parent, args) => {
				let bookEntryId = {_id: args.id}



				return BookEntry.findOneAndDelete(bookEntryId)
			}
		}

	}
})
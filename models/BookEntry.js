import mongoose from 'mongoose'

const bookEntrySchema = new mongoose.Schema({
	userId: {
		type: String,
		required:true
	},
	unitId: {
		type: String,
		required:true
	},
	checkIn: {
		type: String,
		required: true
	},
	checkOut: {
		type: String,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	paymentOpt: {
		type: String,
		required: true
	}
	
},
	{timestamps:true}
)

export const BookEntry = mongoose.model('BookEntry', bookEntrySchema)
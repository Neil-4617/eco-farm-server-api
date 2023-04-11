import mongoose from 'mongoose'

const unitSchema = new mongoose.Schema({
	name : {
		type: String,
		required: true
	},
	description : {
		type: String,
		required: true
	},
	rate : {
		type: String,
		required: true
	},
	capacity : {
		type: String,
		required: true
	},
	unitAvail: {
		type: String,
		required: true
	},
	imgPath: {
		type: String,
		required: true
	}

},
	{timestamps:true}	
)
	
	
export const Unit = mongoose.model('Unit', unitSchema)
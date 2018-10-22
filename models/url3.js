const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
	originalurl:String,
	shorturl:String
});

const ModelClass = mongoose.model('shorturl',urlSchema);


 

module.exports = ModelClass;

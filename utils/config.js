require('dotenv').config()  
// eslint-disable-next-line no-undef
const PORT=process.env.PORT
// eslint-disable-next-line no-undef
const MONGODB_URI=process.env.MONGODB_URI

module.exports = {
	PORT,
	MONGODB_URI
}

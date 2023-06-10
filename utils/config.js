require('dotenv').config()  
// eslint-disable-next-line no-undef
const PORT=process.env.PORT
// eslint-disable-next-line no-undef
const MONGODB_URI = process.env.NODE_ENV === 'test'   ? process.env.TEST_MONGODB_URI  : process.env.MONGODB_URI
console.log(MONGODB_URI)
console.log('---------------------------')
module.exports = {
	PORT,
	MONGODB_URI
}

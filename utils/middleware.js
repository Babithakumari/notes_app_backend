const logger = require('./logger')

const requestLogger = (request,response,next) => {
	logger.info('Method:', request.method)
	logger.info('Path:  ', request.path)
	logger.info('Body:  ', request.body)
	logger.info('---')
	next()

}
// define errorHandler middleware
const unknownEndpoint = (request,response) => {
	response.status(404).send({Error:'Unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
	console.error(error.message)
  
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}
    
	else if(error.name == 'ValidationError'){
		return response.status(400).send({error : error.message})
	}
	else if (error.name ===  'JsonWebTokenError') {    
		return response.status(400).json({ error: error.message })  
	}
	else if (error.name === 'TokenExpiredError') {    
		return response.status(401).json({      
			error: 'token expired'    
		})  
	}
	next(error)
}

module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler
}
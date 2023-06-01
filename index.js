require('dotenv').config()  
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/notes.js')

const generateId = () => {
	const maxId = 10000
	return Math.floor(Math.random()*maxId)
}


const requestLogger = (request,response,next) => {
	console.log('Method:', request.method)
	console.log('Path:  ', request.path)
	console.log('Body:  ', request.body)
	console.log('---')
	next()

}


//takes the JSON data of a request, transforms it into a JavaScript object and then attaches it to the body property of the request object 
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(requestLogger)

// UPDATE IMPORTANCE OF NOTE
app.put('/api/notes/:id', (request,response,next) => {
	const body = request.body

	const note = {
		content: body.content,
		important: body.important
	}


	Note.findByIdAndUpdate(request.params.id, note, {new:true, runValidators:true, context:'query'})
		.then(updatedNote => {
			response.json(updatedNote)
		})
		.catch(error => next(error))

})

// ADD A NEW NOTE
app.post('/api/notes', (request,response, next) => {
	const body = request.body
    
	// make a new note
	const note = new Note({
		content:body.content,
		important:body.important || true,
		id:generateId()
	})

	note.save().then(savedNote => {
		response.json(savedNote)
	})
		.catch(error => next(error))
    
})


app.get('/', (request,response) => {
	response.send('<h1>Hello World!</h1>')
})

// GET ALL NOTES
app.get('/api/notes', (request,response) => {
	Note.find({}).then(notes => {
		response.json(notes)
	})
})

// GET A SPECIFIC NOTE
app.get('/api/notes/:id', (request,response,next) => {
    
	Note.findById(request.params.id).then(note=>{
		if(note){
			response.json(note)

		}
		else{
			response.status(404).end()
		}
        
	})
		.catch(error => next(error))
        
})

// DELETE A NOTE
app.delete('/api/notes/:id', (request,response, next) => {
	Note.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end()
		})
		.catch(error => next(error))
    
})


// define errorHandler middleware
const unknownEndpoint = (request,response) => {
	response.status(404).send({Error:'Unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	console.error(error.message)
  
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}
    
	else if(error.name == 'ValidationError'){
		return response.status(400).send({error : error.message})
	}
  
	next(error)
}
// this has to be the last loaded middleware.
app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT,()=>{
	console.log(`Server running on port ${PORT}`)

})

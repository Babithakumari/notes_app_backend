// create a router object
const notesRouter = require('express').Router()
const Note = require('../models/notes')



// GET ALL NOTES
notesRouter.get('/', (request,response) => {
	Note.find({}).then(notes => {
		response.json(notes)
	})
})

// GET A SPECIFIC NOTE
notesRouter.get('/:id', (request,response,next) => {
    
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

// UPDATE IMPORTANCE OF NOTE
notesRouter.put('/:id', (request,response,next) => {
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

// function to generate id
const generateId = () => {
	const maxId = 10000
	return Math.floor(Math.random()*maxId)
}

// ADD A NEW NOTE
notesRouter.post('/', (request,response, next) => {
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

// DELETE A NOTE
notesRouter.delete('/:id', (request,response, next) => {
	Note.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end()
		})
		.catch(error => next(error))
    
})


// export router
module.exports = notesRouter
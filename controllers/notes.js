// create a router object
const notesRouter = require('express').Router()
const Note = require('../models/notes')



// GET ALL NOTES
notesRouter.get('/', async(request,response) => {
	const notes = await Note.find({})
	response.json(notes)

})

// GET A SPECIFIC NOTE
notesRouter.get('/:id', async(request,response) => {

	
	const note = await Note.findById(request.params.id)
	if(note){
		response.json(note)
	}
	else{
		response.status(404).end()
	}
		
	
    
	
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
notesRouter.post('/', async(request,response) => {
	const body = request.body
    
	// make a new note
	const note = new Note({
		content:body.content,
		important:body.important || true,
		id:generateId()
	})

	const savedNote = await note.save()    
	response.status(201).json(savedNote)  
	
})

// DELETE A NOTE
notesRouter.delete('/:id', async(request,response) => {

	await Note.findByIdAndRemove(request.params.id)
	response.status(204).end()
	
    
})


// export router
module.exports = notesRouter
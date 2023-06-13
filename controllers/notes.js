// create a router object
const notesRouter = require('express').Router()
const Note = require('../models/notes')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {  
	const authorization = request.get('authorization')  
	if (authorization && authorization.startsWith('Bearer ')) {    
		return authorization.replace('Bearer ', '') 
	}  
	return null
}


// GET ALL NOTES
notesRouter.get('/', async(request,response) => {
	const notes = await Note.find({}).populate('user' , { username: 1, name: 1 })
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



// ADD A NEW NOTE
notesRouter.post('/', async(request,response) => {
	const body = request.body
    
	// get the user
	// eslint-disable-next-line no-undef
	console.log(getTokenFrom(request))
	// eslint-disable-next-line no-undef
	const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)  
	if (!decodedToken.id) {    
		return response.status(401).json({ error: 'token invalid' })  
	}
	const user = await User.findById(decodedToken.id)

	// make a new note
	const note = new Note({
		content:body.content,
		important:body.important || true,
		// add user id to the new note
		user:user.id
	})

	const savedNote = await note.save()  
	// add the new note to the user object
	user.notes = user.notes.concat(savedNote._id)
	await user.save()
	response.status(201).json(savedNote)  
	
})

// DELETE A NOTE
notesRouter.delete('/:id', async(request,response) => {

	await Note.findByIdAndRemove(request.params.id)
	response.status(204).end()
	
    
})


// export router
module.exports = notesRouter
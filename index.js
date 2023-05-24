const express = require("express")
const app = express()
const cors = require("cors")

const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
  }


let notes = [
    { id: 1, content: "HTML is easy", important: true }, 
    { id: 2, content: "Browser can execute only JavaScript", important: false }, 
    { id: 3, content: "GET and POST are the most important methods of HTTP protocol", important: true }
]

const requestLogger = (request,response,next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()

}

const unknownEndpoint = (request,response) => {
    response.status(404).send({Error:"Unknown endpoint"})
}

//takes the JSON data of a request, transforms it into a JavaScript object and then attaches it to the body property of the request object 
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(requestLogger)

// ADD A NEW NOTE
app.post("/api/notes", (request,response) => {
    const body = request.body
    

    // validating data submitted
    if(!body.content){
        return response.status(400).json({
            "error":"content missing"
        })
    }
    // otherwise make a new note
    const note = {
        "content":body.content,
        important:body.important|true,
        id:generateId()
    }
    notes = notes.concat(note)

    console.log(note)
    response.json(note)
})


app.get("/", (request,response) => {
    response.send('<h1>Hello World!</h1>')
})

// GET ALL NOTES
app.get("/api/notes", (request,response) => {
    response.json(notes)
})

// GET A SPECIFIC NOTE
app.get("/api/notes/:id", (request,response) => {
    const id = request.params.id
    const note = notes.find(note => {
        return note.id==id
    })
    console.log(note)
    response.json(note)
})

// DELETE A NOTE
app.delete("/api/notes/:id", (request,response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id!=id)
    response.status(204).end()
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)

})

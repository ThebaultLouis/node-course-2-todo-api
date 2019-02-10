var express = require('express');
var bodyParser = require('body-parser');
var {ObjectId} = require('mongodb');


var {mongoose} = require('./db/mongoose.js')
var {User} = require('./models/user');
var {Todo} = require('./models/todo');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
    var todo = new Todo({
      text: req.body.text
    });
    todo.save().then((doc) => {
      res.send(doc);
    }).catch(e => {
      res.status(400).send(e)
    })
});

app.get('/todos', (req, res)=>{
  Todo.find().then(todos => {
    res.send({todos})
  }).catch(e => {
    res.status(400).send(e)
  })
})

app.get('/todos/:id', (req, res) => {
  var id = req.params.id

  if(!ObjectId.isValid(id)){
    res.status(400).send()
  }

  Todo.findById({
    _id: id
  }).then(todo => {
    if (todo){
      res.send({todo})
    }
    else{
      res.status(404).send()
    }
  }).catch(e => res.status(400).send())
})

app.listen(port, () => {
  console.log(`Started in port ${port}`)
})

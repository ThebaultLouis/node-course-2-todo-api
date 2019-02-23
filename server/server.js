var express = require('express');
var bodyParser = require('body-parser');
var {ObjectId} = require('mongodb');
var _ = require('lodash')

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

app.get('/todos', (req, res) => {
  Todo.find().then(todos => {
    res.send({todos})
  }).catch(e => {
    res.status(400).send(e)
  })
})

app.get('/todos/:id', (req, res) => {
  var id = req.params.id

  if(!ObjectId.isValid(id)){
    res.status(404).send()
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
});

app.delete('/todos/:id', (req, res) => {
  id = req.params.id

  if(!ObjectId.isValid(id)){
    res.status(400).send()
  }
  Todo.findByIdAndRemove({
    _id: id
  }).then(todo => {
    if (todo){
      res.send({todo})
    }
    else{
      res.status(404).send()
    }
  }).catch(e => res.status(400).send())
});

app.patch('/todos/:id', (req, res) => {
  id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed'])

  if(!ObjectId.isValid(id)){
    res.status(400).send()
  }

  if (_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then(todo => {
    if (!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch(e => {
    res.status(400).send();
  })
});

// User
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])

  var user = new User(body)
  // user.tokens = {access: 'coucou', token: 'coucou'}

  user.generateAuthToken().then(token => {
    res.header('x-auth', token).send(user)
  }).catch(e => res.status(400).send(e))

  // user.save().then(() => {
  //   return user.generateAuthToken()
  // }).then(token => {
  //   res.header('x-auth', token).send(user)
  // }).catch(e => res.status(400).send(e))

});


app.listen(port, () => {
  console.log(`Started in port ${port}`)
})

module.exports.app = app

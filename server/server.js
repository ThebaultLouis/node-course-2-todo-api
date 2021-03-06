require('./config/config')

var express = require('express');
var bodyParser = require('body-parser');
var {ObjectId} = require('mongodb');
var _ = require('lodash')

var {mongoose} = require('./db/mongoose.js')
var {User} = require('./models/user');
var {Todo} = require('./models/todo');
var {authenticate} = require('./middleware/authenticate')

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json())

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
      text: req.body.text,
      _creator: req.user._id
    });
    todo.save().then((doc) => {
      res.send(doc);
    }).catch(e => {
      res.status(400).send(e)
    })
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then(todos => {
    res.send({todos})
  }).catch(e => {
    res.status(400).send(e)
  })
})

app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id

  if(!ObjectId.isValid(id)){
    res.status(404).send()
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then(todo => {
    if (todo){
      res.send({todo})
    }
    else{
      res.status(404).send()
    }
  }).catch(e => res.status(400).send())
});

app.delete('/todos/:id', authenticate, (req, res) => {
  id = req.params.id

  if(!ObjectId.isValid(id)){
    res.status(400).send()
  }
  Todo.finOnedAndRemove({
    _id: id,
    _creator: req.user._id
  }).then(todo => {
    if (todo){
      res.send({todo})
    }
    else{
      res.status(404).send()
    }
  }).catch(e => res.status(400).send())
});

app.patch('/todos/:id', authenticate, (req, res) => {
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

  Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then(todo => {
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

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])

  User.findByCredentials(body.email, body.password).then(user => {
    user.generateAuthToken().then(token => {
      res.header('x-auth', token).send(user)
    })
  }).catch(e => {
    res.status(400).send()
  })
})

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send()
  }).catch(e => res.status(400).send())
})

app.listen(port, () => {
  console.log(`Started in port ${port}`)
})

module.exports.app = app

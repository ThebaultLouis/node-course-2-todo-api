const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


var id = '5c605d7a7f85f00f672eb913'

if(!ObjectId.isValid(id)){
  console.log('ID not valid')
}

Todo.find({
  _id: id
}).then(todos => {
  console.log('Todo', todo);
});

Todo.findOne({
  _id: id
}).then(todo => {
  console.log('Todo', todo)
})

Todo.findById(id).then(todo) => {
  if (!todo) {
    return console.log('Id not found');
  }
  console.log('Todo By Id', todo);
}).catch(e => console.log(e))


User.findById('5c605d7a7f85f00f672eb913').then(user) => {
  if (!user) {
    return console.log('User not found');
  }
  console.log(JSON.stringify(user, undefined, 2))
}).catch(e => console.log(e))

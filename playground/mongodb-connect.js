var {MongoClient, ObjectID} = require('mongodb');

var url = 'mongodb://localhost:27017/TodoApp';

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect(url, (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log("Connected successfully to server");

  // const db = client.db('TodoApp')
  //
  // db.collection('Todos').insertOne({
  //   text: "First Todo",
  //   completed: false
  // },(err, result) => {
  //   if (err){
  //     return console.log('Unable to insert todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2))
  // })

  const user_db = client.db('TodoApp');

  user_db.collection('Users').insertOne({
    name: "Louis",
    age: "21",
    location: "France"
  }, (err, result) => {
    if (err) {
      return console.log('Unable to insert user', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2))
  })

  client.close();
});

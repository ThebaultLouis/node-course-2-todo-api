const {MongoClient, ObjectID} = require('mongodb');

url = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(url).then(client => {
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');
  // db.collection('Todos').find({
  //   completed: false
  // }).toArray().then(docs => {
  //   console.log(JSON.stringify(docs, undefined, 2))
  // })
  db.collection('Todos').find({
    completed: false
  }).count().then(count => {
    console.log(count)
  })

  client.close();
}).catch(err => {
  console.log(err)
})

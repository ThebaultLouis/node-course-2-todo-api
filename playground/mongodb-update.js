const {MongoClient, ObjectID} = require('mongodb');

url = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(url).then(client => {
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID("adsacess")
  }, {
    $set: {
      completed: true
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then(res => {
    console.log(res)
  })

  client.close();
}).catch(err => {
  console.log(err)
})

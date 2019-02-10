const {MongoClient, ObjectID} = require('mongodb');

url = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(url).then(client => {
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  // db.collection('Todos').deleteOne({text: 'eat lunch'}).then(res => {
  //   console.log(res)
  // });
  // db.collection('Todos').deleteMany({text: 'eat lunch'}).then(res => {
  //   console.log(res)
  // });
  // db.collection('Todos').findOneAndDelete({text: 'eat lunch'}).then(res => {
  //   console.log(res)
  // });

  db.collection('Users').deleteMany({name: 'Andrew'});
  db.collection('Users').findOneAndDelete(_id: new ObjectID('azdzafad'));

  client.close();
}).catch(err => {
  console.log(err)
})

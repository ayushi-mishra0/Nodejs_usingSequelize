const express = require('express')
var bodyParser = require('body-parser')
require('./models')
var userCtrl = require('./controllers/userController')
const app = express()

app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/add', userCtrl.addUser)
app.get('/users', userCtrl.getUsers)
app.get('/users/:id', userCtrl.getUser)
app.post('/users', userCtrl.postUsers)
app.delete('/users/:id', userCtrl.deleteUser)
app.patch('/users/:id', userCtrl.patchUser)
app.get('/query', userCtrl.queryUser)
app.get('/finders', userCtrl.findersUser)
app.get('/get-set-virtual', userCtrl.getSetVirtualUser)
app.get('/validate', userCtrl.validateUser)
app.get('/raw-queries', userCtrl.rawQueriesUser)
app.get('/one-to-one', userCtrl.oneToOneUser)
app.get('/one-to-many', userCtrl.oneToManyUser)
app.get('/many-to-many', userCtrl.manyToManyUser)


// User.sync({force: true});
// Contact.sync({force:true});

app.listen(3000, ()=>{
    console.log('App will run on: http://localhost:3000')
})
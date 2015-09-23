'use strict';

var express  	= require('express');
var moment = require('moment');
var bodyParser = require('body-parser');

var port = 8080;
var app = express();
var incrementalId = 0;

var Todo = function(args) {
  this.id = incrementalId++;
  this.title = args.title;
  this.comment = args.comment;
  this.deadline = args.deadline;
  return this;
};

var todos = [
  new Todo({title: 'Work hard my javascript', comment: 'Because je le vaux bien', deadline: new Date()}),
  new Todo({title: 'Finish translation tool', comment: 'Sooner better than never, huh?', deadline: moment().add(5, 'd').toDate()})
]

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-METHODS", "GET, POST, PUT, DELETE");
  next();
});

app.get('/todos', function(req, res) {
	return res.status(200).send(todos);
});

app.post('/todo', function(req, res) {
  var newTodo = req.body;
  if (newTodo.title === undefined || newTodo.title.trim() === '') {
    return res.status(400).send({title: 'You failed!', message: 'the title is invalid'});
  } else {
    todos.push(new Todo(newTodo));
    return res.status(200).send({title: 'Todo was succesfully created!'});
  }
});

app.delete('/todo/:id', function(req, res) {
  var initial = todos.length;
  var todoId = parseInt(req.params.id);

  todos = todos.filter(function(todo) {
    return todo.id !== todoId;
  });

  if (initial === todos.length) {
    return res.status(200).send({title: 'Ok... but nothing to delete'});
  } else {
    return res.status(200).send({title: 'Todo was succesfully deleted!'});
  }
});

app.listen(port, function() {
  console.log('App listening on port '+ port);
});

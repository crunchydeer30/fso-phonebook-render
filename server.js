require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

morgan.token('body', (request, response) => JSON.stringify(request.body));
app.use(express.static('build'));
app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time :body')
);
app.use(cors());

app.get('/', (request, response) => {
  response.send('Phonebook API');
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person);
    }
    else {
      response.status(404).end();
    }
  })
  .catch(error => {
    console.log(error);
    response.status(500).end();
  })
});

app.delete('/api/persons/:id', (request, response) => {
  const id = +request.params.id;

  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.get('/info', (request, response) => {
  const numPersons = persons.length;
  const curDate = new Date();

  response.send(`
    <p>Phonebook has info for ${numPersons} people</p>
    <p>${curDate}</p>
  `);
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({ error: 'name missing' });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

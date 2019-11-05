if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Person = require('./models/person');
const morgan = require('morgan');

app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

morgan.token('body', (request, response) => {
  return JSON.stringify(request.body);
});

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms - :body'
  )
);

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1
  },
  {
    name: 'Ada Lovelac',
    number: '39-44-532332',
    id: 2
  },
  {
    name: 'Dan Abramoc',
    number: '12-43-2131331',
    id: 3
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6514431',
    id: 4
  }
];

app.use(express.static('build'));

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()));
  });
});

app.get('/info', (request, response) => {
  const date = new Date();
  response.send(
    `<p>Phone has info for ${persons.length} people<p><p>${date}</p>`
  );
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person.toJSON());
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

// const generateId = max => {
//   return Math.floor(Math.random() * Math.floor(max));
// };

const findDupeName = (array, name) => {
  let foundDupe = false;
  console.log('ARRAY:', array);
  console.log('NAME:', name);

  array.filter(person => {
    if (person.name === name) {
      return (foundDupe = true);
    }
  });
  return foundDupe;
};

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  // const id = generateId(500);
  const dupeFound = findDupeName(persons, body.name);
  console.log(dupeFound);

  if (body.name === undefined) {
    return response.status(400).json({
      error: 'name missing'
    });
  } else if (body.number === undefined) {
    return response.status(400).json({
      error: 'number missing'
    });
  } else if (dupeFound === true) {
    return response.status(400).json({
      error: 'name already exists'
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson.toJSON());
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number
  };

  Person.findByIdAndUpdate(request.params.id, person)
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON());
    })
    .catch(error => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

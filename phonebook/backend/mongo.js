const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('missing password');
  process.exit(1);
}

const password = process.argv[2];
const inputName = process.argv[3];
const inputNumber = process.argv[4];

const url = `mongodb+srv://fullstack:${password}@cluster0-illp5.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
  name: inputName,
  number: inputNumber
});

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length === 5) {
  person.save().then(response => {
    console.log('hello??');
    console.log(`added ${inputName} number ${inputNumber} to phonebook`);
    mongoose.connection.close();
  });
}

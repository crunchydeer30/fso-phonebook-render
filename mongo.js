const mongoose = require('mongoose');

const numArgs = process.argv.length;

if (numArgs < 3) {
  console.log('provide a password as argument');
  process.exit(1);
} else if (numArgs > 5) {
  console.log('too many arguments');
  process.exit(1);
} else if (numArgs === 4) {
  console.log('number is missing');
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3] ? process.argv[3] : null;
const number = process.argv[4] ? process.argv[4] : null;

const url = `mongodb+srv://admin:${password}@cluster0.fk7kmxv.mongodb.net/phonebookApp?retryWrites=true&w=majority`;
mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (numArgs === 3) {
  console.log('phonebook: ');
  Person.find({}).then((persons) => {
    if (persons.length === 0) {
      console.log('empty');
    } else {
      persons.forEach((person) => {
        console.log(person);
      });
    }
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name,
    number,
  });

  person.save().then((result) => {
    console.log('person saved');
    mongoose.connection.close();
  });
}

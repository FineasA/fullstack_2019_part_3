import React, { useState, useEffect } from 'react';
import Contacts from './components/Contacts';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import personService from './services/persons';
import SuccessNotification from './components/SuccessNotification';
import ErrorNotification from './components/ErrorNotification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('a new name...');
  const [newNumber, setNewNumber] = useState('a new number...');
  const [findName, setFoundName] = useState('filter name...');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // * SERVER SIDE

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons);
    });
  }, []);

  // * STATE CHANGES

  const addName = e => {
    e.preventDefault();
    const namesObject = {
      name: newName,
      number: newNumber
    };

    if (
      persons.some(
        p => p.name === namesObject.name && p.number !== namesObject.number
      )
    ) {
      const result = window.confirm(
        `${namesObject.name} is already added to the phonebook, replace the older number with a new one?`
      );
      if (result === true) {
        const person = persons.find(p => p.name === namesObject.name);
        const changedPerson = { ...person, number: newNumber };

        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(
              persons.map(p => (p.id !== changedPerson.id ? p : returnedPerson))
            );
            setSuccessMessage(
              `The number for ${changedPerson.name} has been changed successfully.`
            );
            setTimeout(() => {
              setSuccessMessage(null);
            }, 5000);
          })
          .catch(error => {
            setErrorMessage(
              `Information of ${changedPerson.name} has already been removed from the server. Please reload the page and try again.`
            );
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          });
      }
    } else {
      personService
        .create(namesObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setSuccessMessage(`Added ${namesObject.name}`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
        })
        .catch(error => {
          setErrorMessage(`${error.response.data.error}`);

          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
    setNewName('');
    setNewNumber('');
  };

  const removePerson = (id, name) => {
    const result = window.confirm(`Delete ${name}?`);
    if (result === true) {
      const person = persons.filter(p => p.id !== id);
      console.log(persons);
      personService.remove(id, person).then(returnedPerson => {
        setPersons(person);
      });
    } else {
      return;
    }
  };

  const searchName = e => {
    e.preventDefault();
    const searchedName = findName;

    setFoundName(searchedName);
    console.log(searchedName);
  };

  // * HANDLERS

  const handleNameChange = e => {
    setNewName(e.target.value);
    // console.log(e.target.value);
  };

  const handleNumberChange = e => {
    setNewNumber(e.target.value);
  };

  const handleNameFilter = e => {
    setFoundName(e.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />
      <Filter
        searchName={searchName}
        findName={findName}
        handleNameFilter={handleNameFilter}
      />
      <h2>Add a new contact</h2>
      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Contacts
        content={persons}
        requestedFilter={findName}
        removePerson={removePerson}
      />
      {/* <div>debug: {newName}</div> */}
    </div>
  );
};

export default App;

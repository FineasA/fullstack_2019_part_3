import React from 'react';

const Contacts = props => {
  const filteredNames = props.content.map(person => ({
    name: person.name,
    number: person.number
  }));
  //   console.log(filteredNames);

  const result = filteredNames.filter(name => {
    // console.log(name.name, props.requestedFilter);
    const currentFiltered = name.name
      .toLowerCase()
      .includes(props.requestedFilter.toLowerCase());
    return currentFiltered;
  });

  //   console.log('result', result);
  //   console.log('from contacts', props.content);

  let personsList = props.content.map((person, index) => {
    return (
      <li key={index}>
        {person.name} : {person.number} :{' '}
        <button onClick={() => props.removePerson(person.id, person.name)}>
          delete
        </button>
      </li>
    );
  });
  if (
    props.requestedFilter.length > 0 &&
    props.requestedFilter !== 'filter name...'
  ) {
    personsList = result.map((person, index) => {
      return (
        <li key={index}>
          {person.name} : {person.number}
        </li>
      );
    });
  }
  return <ul>{personsList}</ul>;
};

export default Contacts;

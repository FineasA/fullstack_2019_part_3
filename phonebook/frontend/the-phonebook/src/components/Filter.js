import React from 'react';

const Filter = props => {
  return (
    <form onSubmit={props.searchName}>
      <div>
        Find name:{' '}
        <input value={props.findName} onChange={props.handleNameFilter} />
      </div>
    </form>
  );
};

export default Filter;

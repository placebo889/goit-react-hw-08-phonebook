import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFilter } from '../../../Redux/contactSlice';
import InputAdornment from '@mui/material/InputAdornment';

const Filter = () => {
  const dispatch = useDispatch();
  const filter = useSelector(state => state.contacts.filter) || '';

  const handleFilterChange = e => {
    dispatch(updateFilter(e.target.value.toLowerCase()));
  };

  return (
    <div className="search-wrapper">
      <label>
        Search contacts
        <input
          className="input"
          type="text"
          value={filter}
          onChange={handleFilterChange}
          InputProps={{
            startAdornment: <InputAdornment position="start" />,
          }}
        />
      </label>
    </div>
  );
};

export default Filter;

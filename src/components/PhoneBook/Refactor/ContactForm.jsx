import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addContact } from '../../../Redux/contactSlice';
import { nanoid } from 'nanoid';
import { Report } from 'notiflix/build/notiflix-report-aio';

const ContactForm = () => {
  const dispatch = useDispatch();
  const contacts = useSelector(state => state.contacts.contacts);
  const isAdding = useSelector(state => state.contacts.isAdding);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  const handleInputChange = e => {
    const { name, value } = e.target;
    if (name === 'name') {
      setName(value.charAt(0).toUpperCase() + value.slice(1));
    } else if (name === 'number') {
      setNumber(value.replace(/\D/g, '')); // Замінює всі символи, крім цифр
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!isAuthenticated) {
      Report.failure(
        'Authentication Required',
        'Please register or log in to add a contact.',
        'Okay'
      );
      return;
    }

    if (
      contacts.some(
        contact => contact.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      Report.warning(
        'This name is already in contacts',
        `Contact with name "${name}" is already in contacts`,
        'Okay'
      );
      return;
    }

    const newContact = {
      id: nanoid(),
      name,
      number,
    };

    try {
      await dispatch(addContact(newContact));
      Report.success(
        'Contact added',
        `Contact with name "${newContact.name}" was added`,
        'Okay'
      );
      setName('');
      setNumber('');
    } catch (error) {
      Report.failure(
        'Failed to add contact',
        'An error occurred while adding the contact',
        'Okay'
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2 className="title">Phonebook</h2>
        <label>
          Name
          <input
            className="input"
            type="text"
            name="name"
            value={name}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Number
          <input
            className="input"
            type="tel"
            name="number"
            value={number}
            onChange={handleInputChange}
            pattern="[0-9]*"
            required
          />
        </label>

        <button className="btn" type="submit" disabled={isAdding}>
          {isAdding ? 'Adding...' : 'Add Contact'}
        </button>
      </form>
    </>
  );
};

export default ContactForm;

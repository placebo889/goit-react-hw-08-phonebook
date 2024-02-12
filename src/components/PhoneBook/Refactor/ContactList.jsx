import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteContact } from '../../../Redux/contactSlice';
import { Report } from 'notiflix/build/notiflix-report-aio';

const ContactList = () => {
  const dispatch = useDispatch();
  const contacts = useSelector(state => state.contacts.contacts) || [];
  const filter = useSelector(state => state.contacts.filter) || '';
  const isDeleting = useSelector(state => state.contacts.isDeleting);

  const filteredContacts = contacts.filter(
    contact =>
      contact.name && contact.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDeleteContact = id => {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
      dispatch(deleteContact(id))
        .then(() => {
          Report.success(
            'Contact deleted',
            `Contact with name: "${contact.name}" was deleted`,
            'Okay'
          );
        })
        .catch(() => {
          Report.failure(
            'Failed to delete contact',
            'An error occurred while deleting the contact',
            'Okay'
          );
        });
    }
  };

  const handleClearContacts = async () => {
    try {
      const filteredContacts = contacts.filter(
        contact =>
          contact.name &&
          contact.name.toLowerCase().includes(filter.toLowerCase())
      );

      for (const contact of filteredContacts) {
        await dispatch(deleteContact(contact.id));
      }
      Report.success(
        'All contacts cleared',
        'The contacts were cleared',
        'Okay'
      );
    } catch (error) {
      Report.failure(
        'Failed to clear contacts',
        'An error occurred while clearing contacts',
        'Okay'
      );
    }
  };

  return (
    <div className="container contacts-wrapper">
      <ul className="list">
        {filteredContacts.map(contact => (
          <li key={contact.id} className="contact-item">
            <p className="contact-txt">
              {contact.name}: <b>{contact.number}</b>
            </p>
            <button
              onClick={() => handleDeleteContact(contact.id)}
              className="btn-delite"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
      <button className="btn" onClick={handleClearContacts}>
        Clear Contacts
      </button>
    </div>
  );
};

export default ContactList;

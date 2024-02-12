import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Home from './Refactor/home';
import ContactForm from './Refactor/ContactForm';
import Filter from './Refactor/Filter';
import ContactList from './Refactor/ContactList';
import { fetchContacts } from '../../Redux/contactSlice';

const Phonebook = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.contacts.isLoading);
  const error = useSelector(state => state.contacts.error);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchContacts());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className="container">
      <div className="wrapper user-wrapper">
        {isAuthenticated ? (
          <>
            <ContactForm />
          </>
        ) : (
          <Home />
        )}

        {isAuthenticated && (
          <div className="contactsSection">
            <h2 className="title">Contacts</h2>
            <Filter />
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <ContactList />
          </div>
        )}
      </div>
    </div>
  );
};

export default Phonebook;

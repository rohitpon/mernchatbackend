import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ListItem from './ChatListItem';
import { useChatContext } from '../../context/ChatContext';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

function ChatContactList() {
  const { contacts, handleChatSelect } = useChatContext();
  const [display, setDisplay] = useState({
    rooms: true,
    users: true
  });
  const [searchInput, setSearchInput] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);

  useEffect(() => {
    const filteredContacts = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredContacts(filteredContacts);
  }, [searchInput, contacts]);

  const contactGroups = filteredContacts.reduce(
    (prev, curr) => {
      curr?.chatType === 'room' ? prev.rooms.push(curr) : prev.users.push(curr);
      return prev;
    },
    {
      rooms: [],
      users: []
    }
  );

  const handleToggleDisplay = (key) => {
    setDisplay((prev) => ({ ...prev, [key]: !display[key] }));
  };

  const renderedGroups = Object.entries(contactGroups).map(([key, values]) => {
    const renderedContacts = values.map((contact) => {
      const { _id, avatarImage, ...otherContact } = contact;
      return (
        <ListItem
          key={_id}
          contactId={_id}
          avatarImage={avatarImage ? `data:image/svg+xml;base64, ${avatarImage}` : '/user.png'}
          handleItemClick={(e) => handleChatSelect(contact)}
          {...otherContact}
        />
      );
    });

    return (
      <ListGroup key={key}>
        <GroupTitle onClick={() => handleToggleDisplay(key)}>
          {key}
          { display[key] ? <BiChevronDown /> : <BiChevronUp /> }
        </GroupTitle>

        {display[key] ? (
          <input
            onChange={(event) => setSearchInput(event.target.value)}
            type="text"
            style={{
            borderRadius: '8px',
            color: '#333', // Text color
            border: '2px solid #000', // Border color
            backgroundColor: '#f5f5f5', // Background color
            outline: 'none',
            fontWeight: 'bold', // Text weight
            width: '100%',
            padding: '12px 16px', // Padding
            height: '40px',
            margin: '10px auto',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Box shadow
            transition: 'border-color 0.2s ease', // Smooth border transition
            }}
                placeholder={`Search ${key}...`}
            />
        ) : null}
        {display[key] ? renderedContacts : null}
      </ListGroup>
    );
  });

  return <List>{renderedGroups}</List>;
}

const List = styled.div`
  width: 100%;
  max-width: 480px;
  height: 100%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    background-color: var(--bg-color-main);
    width: 6px;
    &-thumb {
      background-color: var(--bg-color-darken);
      border-radius: 8px;
    }
  }
`;

const ListGroup = styled.ul`
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GroupTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: var(--main-color);
  align-self: flex-start;
  margin-bottom: 4px;
  text-transform: capitalize;
  cursor: pointer;
`;

export default ChatContactList;

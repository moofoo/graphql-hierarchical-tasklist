import React, { useState, useContext } from 'react';
import { NavDropdown, Modal, Button, FormControl } from 'react-bootstrap';
import { useMutation } from 'react-apollo';
import { ADD_TASK_LIST } from '../../graphql/mutations';
import { Context } from '../../context';

const SelectTaskList = ({ taskLists, loading }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [listTitle, setListTitle] = useState('');

  const showModal = () => {
    setModalVisible(true);
    setListTitle('');
  };
  const hideModal = () => setModalVisible(false);

  const [addTaskList] = useMutation(ADD_TASK_LIST, {
    refetchQueries: ['TaskLists']
  });

  const {
    state: { selectedIndex },
    setSelectedList
  } = useContext(Context);

  const renderDropdownItems = () => {
    if (loading) {
      return null;
    }

    return taskLists.map((list, index) => {
      return (
        <NavDropdown.Item
          key={list.id}
          onClick={() => setSelectedList(index, list.id)}
        >
          {list.title}
        </NavDropdown.Item>
      );
    });
  };

  return (
    <>
      <NavDropdown
        title={loading ? 'Loading' : taskLists[selectedIndex].title}
        id='nav-dropdown'
      >
        {renderDropdownItems()}
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={showModal}>Create New List</NavDropdown.Item>
      </NavDropdown>

      <Modal show={modalVisible} onHide={hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>New Task List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormControl
            placeholder='Enter Task List Title'
            value={listTitle}
            onChange={e => setListTitle(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={hideModal}>
            Cancel
          </Button>
          <Button
            variant='primary'
            onClick={() => {
              addTaskList({
                variables: {
                  title: listTitle
                }
              });
              hideModal();
            }}
          >
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SelectTaskList;

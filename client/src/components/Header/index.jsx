import React, { useEffect, useContext } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useQuery } from 'react-apollo';
import { QUERY_TASKLISTS } from '../../graphql/queries';
import { Context } from '../../context';
import SelectTaskList from './SelectTaskList';
import AddTask from './AddTask';
import ClearComplete from './ClearComplete';

const Header = () => {
  const { loading, data } = useQuery(QUERY_TASKLISTS);

  const { setSelectedList } = useContext(Context);

  useEffect(() => {
    if (data) {
      setSelectedList(0, data.taskLists[0].id);
    }
  }, [loading]);

  return (
    <Navbar bg='light'>
      <Nav className='mr-auto'>
        <SelectTaskList
          taskLists={loading ? [] : data.taskLists}
          loading={loading}
        />
      </Nav>
      <Nav>
        <AddTask /> <ClearComplete />
      </Nav>
    </Navbar>
  );
};

export default Header;

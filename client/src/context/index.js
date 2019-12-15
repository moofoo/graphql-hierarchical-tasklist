import createStateContext from './createStateContext';

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_HIDDEN_TASKS': {
      return {
        ...state,
        hiddenTasks: action.hiddenTasks
      };
    }
    case 'SET_SELECTED_LIST':
      return {
        ...state,
        selectedIndex: action.listIndex,
        selectedId: action.listId
      };
    default:
      return state;
  }
};

const setSelectedList = dispatch => (listIndex, listId) => {
  dispatch({
    type: 'SET_SELECTED_LIST',
    listIndex,
    listId
  });
};

const setHiddenTasks = dispatch => hiddenTasks => {
  dispatch({
    type: 'SET_HIDDEN_TASKS',
    hiddenTasks
  });
};

export const { Context, Provider } = createStateContext(
  reducer,
  { setSelectedList, setHiddenTasks },
  { selectedIndex: 0, selectedId: '', hiddenTasks: [] }
);

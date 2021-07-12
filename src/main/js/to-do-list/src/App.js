import { useEffect, useState } from 'react';
import TaskTable from './component/TaskTable';
import WithTableLoading from './component/withTableLoading';
import axios from 'axios'

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

function App() {

  const apiUrl = 'http://localhost:8080/rest/api/v1/tasks';

  const TaskLoading = WithTableLoading(TaskTable);
  const [appState, setAppState] = useState({
    loading: false,
    tasks: null,
  });

  useEffect(async () => {
    setAppState({ loading: true });
    await axios.get(apiUrl).then((tasks) => {
      const allTasks = tasks.data._embedded.tasks;
      setAppState({ loading: false, tasks: allTasks });
    });
  }, [setAppState]);

  return (
    <div className='App'>
      <Container> 
        <div className='container'>
          <Typography color="textPrimary" gutterBottom variant="h3" align="center">
            My Tasks
          </Typography>
        </div>
        <div className='task-container'>
          <TaskLoading isLoading={appState.loading} tasks={appState.tasks} />
        </div>
      </Container>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import TaskTable from "./component/TaskTable";
import WithTableLoading from "./component/withTableLoading";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { getTasks } from "./component/ApiUtils";

function App() {
  const TaskLoading = WithTableLoading(TaskTable);
  const [appState, setAppState] = useState({
    loading: false,
    tasks: null,
  });

  useEffect(() => {
    setAppState({ loading: true });
    async function loadData() {
      const allTasks = await getTasks();
      setAppState({ loading: false, tasks: allTasks });
    }
    loadData();
  }, [setAppState]);

  return (
    <div className="App">
      <Container>
        <div className="container">
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h3"
            align="center"
          >
            My Tasks
          </Typography>
        </div>
        <div className="task-container">
          <TaskLoading isLoading={appState.loading} tasks={appState.tasks} />
        </div>
      </Container>
    </div>
  );
}

export default App;

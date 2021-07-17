import React, { useState } from "react";

import Moment from "react-moment";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import ModalTask from "./ModalTask";
import {
  addNewTask,
  deleteTask,
  editTask,
  finishTask,
  correctedDate,
  getTasks,
  obtainRowID,
} from "./ApiUtils";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  table: {
    minWidth: 650,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const TaskTable = (props) => {
  const [tasks, setTasks] = useState(props.tasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDel, setOpenDel] = useState(false);

  const classes = useStyles();

  const handleNew = async () => {
    const data = {
      taskDescription: document.getElementById("addTask-input").value,
      isDone: false,
      creationDate: correctedDate(moment().format()),
      finishDate: null,
    };

    await addNewTask(data);
    setTasks(await getTasks());
    setOpenAdd(false);
  };

  const handleEdit = async (task) => {
    const data = {
      taskDescription: document.getElementById("editTask-input").value,
      isDone: task.isDone,
      creationDate: correctedDate(task.creationDate),
      finishDate: correctedDate(task.finishDate),
    };

    await editTask(task, data);
    setTasks(await getTasks());
    setOpenEdit(false);
  };

  const handleFinish = async (task) => {
    let isDone = task.isDone;
    let finishDate = correctedDate(moment().format());

    if (isDone === false) {
      isDone = true;
    } else {
      isDone = false;
      finishDate = null;
    }

    const data = {
      isDone: isDone,
      finishDate: finishDate,
    };

    await finishTask(task, data);
    setTasks(await getTasks());
  };

  const handleDelete = async (task) => {
    await deleteTask(task);
    setTasks(await getTasks());
    setOpenDel(false);
  };

  const addModal = (
    <ModalTask
      isOpen={openAdd}
      setOpen={setOpenAdd}
      text="Add Task"
      action={handleNew}
    >
      <TextField
        id="addTask-input"
        type="text"
        required={true}
        autoFocus={true}
        label="Description"
        placeholder="Add a description"
        helperText="Add a new task"
        variant="outlined"
      />
    </ModalTask>
  );

  const editModal = (
    <ModalTask
      isOpen={openEdit}
      setOpen={setOpenEdit}
      text="Edit Task"
      action={() => {
        handleEdit(selectedTask);
      }}
    >
      <TextField
        id="editTask-input"
        type="text"
        required={true}
        autoFocus={true}
        label="Description"
        defaultValue={selectedTask ? selectedTask.taskDescription : ""}
        placeholder="Edit the description"
        helperText="Edit this task"
        variant="outlined"
      />
    </ModalTask>
  );

  const deleteModal = (
    <ModalTask
      isOpen={openDel}
      setOpen={setOpenDel}
      text="Are you sure that you want to delete this task?"
      action={() => {
        handleDelete(selectedTask);
      }}
    ></ModalTask>
  );

  if (!tasks || tasks.length === 0) {
    return (
      <div>
        <Typography
          color="textPrimary"
          gutterBottom
          variant="h6"
          align="center"
        >
          No tasks, try adding some ;D
        </Typography>
        <Button onClick={() => setOpenAdd(true)}>Add Task</Button>
        {addModal}
      </div>
    );
  }

  return (
    <ul>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Done</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Finished</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={obtainRowID(task)} id={"task" + obtainRowID(task)}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={task.isDone}
                    onClick={() => handleFinish(task)}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {task.isDone ? (
                    <strike>{task.taskDescription}</strike>
                  ) : (
                    task.taskDescription
                  )}
                </TableCell>
                <TableCell>
                  <Moment format="YYYY/MM/DD - hh:mm:ss A">
                    {task.creationDate}
                  </Moment>
                </TableCell>
                <TableCell>
                  {task.finishDate ? (
                    <Moment format="YYYY/MM/DD - hh:mm:ss A">
                      {task.finishDate}
                    </Moment>
                  ) : (
                    ""
                  )}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    aria-label="edit"
                    onClick={() => {
                      setOpenEdit(true);
                      setSelectedTask(task);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => {
                      setOpenDel(true);
                      setSelectedTask(task);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <br />
      <div>
        <Button onClick={() => setOpenAdd(true)}>Add Task</Button>
      </div>
      <br />

      {addModal}
      {editModal}
      {deleteModal}
    </ul>
  );
};
export default TaskTable;

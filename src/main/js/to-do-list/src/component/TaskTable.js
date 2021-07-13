import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  table: {
    minWidth: 650,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const TaskTable = (props) => {
  const [tasks, setTasks] = useState(props.tasks);
  const [selectedTask, setSelectedTask] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDel, setOpenDel] = useState(false);

  const classes = useStyles();

  const apiUrl = 'http://localhost:8080/rest/api/v1/tasks';

  const options = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const addNewTask = async () => {
    const data = {
      "taskDescription": document.getElementById('addTask-input').value,
      "isDone" : false,
      "creationDate" : new Date(),
      "finishDate" : null
    };

    await axios.post(apiUrl, data, options);
    setTasks((await axios.get(apiUrl)).data._embedded.tasks);
    setOpenAdd(false);
  }

  const editTask = async (task) => {
    const data = {
      "taskDescription": document.getElementById('editTask-input').value,
      "isDone" : task.isDone,
      "creationDate" : task.creationDate,
      "finishDate" : task.finishDate
    };

    await axios.put(task._links.self.href, data, options);
    setTasks((await axios.get(apiUrl)).data._embedded.tasks);
    setOpenEdit(false);
  }

  const finishTask = async (task) => {
    let isDone = task.isDone;
    let finishDate = new Date();

    if(isDone === false) {
			isDone = true;
		} else {
			isDone = false;
      finishDate = null;	
		}

    const data = {
      "isDone" : isDone,
      "finishDate" : finishDate
    };

    await axios.patch(task._links.self.href, data, options);
    setTasks((await axios.get(apiUrl)).data._embedded.tasks);
  }

  const deleteTask = async (task) => {
    await axios.delete(task._links.self.href);
    setTasks((await axios.get(apiUrl)).data._embedded.tasks);
    setOpenDel(false);
  }

  const convertedDate = (timestamp) => {
    if(timestamp != null) {
      return `${new Date(timestamp).toDateString()} - ${new Date(timestamp).toTimeString().split(' ')[0]}`;
    } else {
      return timestamp;
    }
  }

  const obtainRowID = (task) => {
    return task._links.self.href.substring(task._links.self.href.lastIndexOf('/')+1);
  }

  const addModal = (
    <Fade in={openAdd}>
      <form className={classes.root} noValidate autoComplete="off">
        <div className={classes.paper}>
            <Typography color="textPrimary" gutterBottom variant="h6">Add Task</Typography>
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
            <div align="right">
                <Button variant="outlined" color="primary" onClick={addNewTask}>Add</Button>
                &nbsp;&nbsp;&nbsp;
                <Button variant="outlined" color="secondary" onClick={() => setOpenAdd(false)}>Cancel</Button>
            </div>
        </div>
      </form>
    </Fade>
  )

  const editModal = (
    <Fade in={openEdit}>
      <form className={classes.root} noValidate autoComplete="off">
        <div className={classes.paper}>
            <Typography color="textPrimary" gutterBottom variant="h6">Edit Task</Typography>
            <TextField
                id="editTask-input"
                type="text"
                required={true}
                autoFocus={true}
                label="Description"
                placeholder="Edit the description"
                helperText="Edit this task"
                variant="outlined"
            />
            <div align="right">
                <Button variant="outlined" color="primary" onClick={() => editTask(selectedTask)}>Edit</Button>
                &nbsp;&nbsp;&nbsp;
                <Button variant="outlined" color="secondary" onClick={() => setOpenEdit(false)}>Cancel</Button>
            </div>
        </div>
      </form>
    </Fade>
  )

  const deleteModal = (
    <Fade in={openDel}>
      <form className={classes.root} noValidate autoComplete="off">
        <div className={classes.paper}>
            <Typography color="textPrimary" gutterBottom variant="body2">
              Are you sure that you want to delete this task?            
            </Typography>
            <div align="center">
                <Button variant="outlined" color="secondary" onClick={() => deleteTask(selectedTask)}>Delete</Button>
                &nbsp;&nbsp;&nbsp;
                <Button variant="outlined" color="primary" onClick={() => setOpenDel(false)}>Cancel</Button>
            </div>
        </div>
      </form>
    </Fade>
  )

  if (!tasks || tasks.length === 0) {
    return (
      <div>
        <Typography color="textPrimary" gutterBottom variant="h6" align="center">No tasks, try adding some ;D</Typography>
        <Button onClick={() => setOpenAdd(true)}>Add Task</Button>
        <div className={classes.root}>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
        {addModal}
        </Modal>
      </div>
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
                    <Checkbox checked={task.isDone} onClick={() => finishTask(task)} />
                  </TableCell>
                  <TableCell component="th" scope="row">{task.taskDescription}</TableCell>
                  <TableCell>{convertedDate(task.creationDate)}</TableCell>
                  <TableCell>{convertedDate(task.finishDate)}</TableCell>
                  <TableCell align="center">
                    <IconButton aria-label="edit" onClick={() => {setOpenEdit(true); setSelectedTask(task)}}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => {setOpenDel(true); setSelectedTask(task)}}>
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
      <div className={classes.root}>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
        {addModal}
        </Modal>
      </div>
      <div className={classes.root}>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
        {editModal}
        </Modal>
      </div>
      <div className={classes.root}>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={openDel}
          onClose={() => setOpenDel(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
        {deleteModal}
        </Modal>
      </div>
    </ul>
  );
};
export default TaskTable;
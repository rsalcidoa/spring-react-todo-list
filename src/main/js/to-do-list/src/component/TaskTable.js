import React from 'react';

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
  const classes = useStyles();
  const { tasks } = props;
  const [open, setOpen] = React.useState(false);

  if (!tasks || tasks.length === 0) 
    return <Typography color="textPrimary" gutterBottom variant="p" align="center">No tasks, try adding some ;D</Typography>;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ul>
      <Typography color="textPrimary" gutterBottom variant="h2" align="center">
        Pending Tasks
      </Typography>
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
    {tasks.map((task) => (
          <TableBody>
            <TableRow key={task.taskID}>
              <TableCell padding="checkbox">
                <Checkbox checked={task.isDone}/>
              </TableCell>
              <TableCell component="th" scope="row">{task.taskDescription}</TableCell>
              <TableCell>{task.creationDate}</TableCell>
              <TableCell>{task.finishDate}</TableCell>
              <TableCell align="center">
                <IconButton aria-label="edit">
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
    ))}
        </Table>
      </TableContainer>

      <br />
        <div>
          <Button onClick={handleOpen}>New</Button>
        </div>
      <br />

      <div className={classes.root}>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <form className={classes.root} noValidate autoComplete="off">
              <div className={classes.paper}>
                  <TextField
                      id="addTask-input"
                      label="Description"
                      defaultValue="Add Task Description..."
                      helperText="Add new task"
                      variant="filled"
                  />
                  <div align="right">
                      <Button variant="contained" color="primary">Add</Button>
                      &nbsp;&nbsp;&nbsp;
                      <Button variant="contained" color="secondary" onClick={handleClose}>Cancel</Button>
                  </div>
              </div>
            </form>
          </Fade>
        </Modal>
      </div>
    </ul>
  );
};
export default TaskTable;

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
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const TaskTable = (props) => {
  const classes = useStyles();
  const { tasks } = props;
  if (!tasks || tasks.length === 0) return <p>No tasks, sorry</p>;
  return (
    <ul>
      <Typography className='list-head' color="textPrimary" gutterBottom variant="h2" align="center">
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
							<TableCell></TableCell>
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
              <TableCell>
                <IconButton aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
    ))}
        </Table>
      </TableContainer>
    </ul>
  );
};
export default TaskTable;

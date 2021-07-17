import axios from "axios";
import moment from "moment";

const { REACT_APP_TODO_LIST_WEBAPP_API_URL } = process.env;

const options = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const getTasks = async () => {
  return (await axios.get(REACT_APP_TODO_LIST_WEBAPP_API_URL)).data._embedded
    .tasks;
};

export const addNewTask = async (data) => {
  await axios.post(REACT_APP_TODO_LIST_WEBAPP_API_URL, data, options);
};

export const editTask = async (task, data) => {
  await axios.put(task._links.self.href, data, options);
};

export const finishTask = async (task, data) => {
  await axios.patch(task._links.self.href, data, options);
};

export const deleteTask = async (task) => {
  await axios.delete(task._links.self.href);
};

export const obtainRowID = (task) => {
  return task._links.self.href.substring(
    task._links.self.href.lastIndexOf("/") + 1
  );
};

export const correctedDate = (timestamp) => {
  return moment(timestamp).subtract(5, "h");
};

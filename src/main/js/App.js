const React = require('react');
const ReactDOM = require('react-dom');
const Client = require('./client');

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {tasks: []};
	}

	componentDidMount() {
		Client({method: 'GET', path: '/rest/api/v1/tasks'}).done(response => {
			this.setState({tasks: response.entity._embedded.tasks});
		});
	}

	render() {
		return (
			<TaskList tasks={this.state.tasks}/>
		)
	}
}

class TaskList extends React.Component{
	render() {
		const tasks = this.props.tasks.map(task =>
			<Task key={task._links.self.href} task={task}/>
		);
		return (
			<table>
				<tbody>
					<tr>
						<th>Description</th>
						<th>Done?</th>
						<th>Created</th>
						<th>Finished</th>
					</tr>
					{tasks}
				</tbody>
			</table>
		)
	}
}

class Task extends React.Component{
	render() {
		return (
			<tr>
				<td>{this.props.task.taskDescription}</td>
				<td>{this.props.task.isDone}</td>
				<td>{this.props.task.creationDate}</td>
				<td>{this.props.task.finishDate}</td>
			</tr>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('react')
)
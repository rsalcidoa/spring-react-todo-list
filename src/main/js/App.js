'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
const follow = require('./follow'); // function to hop multiple links by "rel"

const root = '/rest/api/v1'

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {tasks: [], attributes: [], pageSize: 2, links: {}};
		this.updatePageSize = this.updatePageSize.bind(this);
		this.onCreate = this.onCreate.bind(this);
		this.onUpdate = this.onUpdate.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onNavigate = this.onNavigate.bind(this);
	}

	loadFromServer(pageSize) {
		follow(client, root, [
			{rel: 'tasks', params: {size: pageSize}}]
		).then(taskCollection => {
			return client({
				method: 'GET',
				path: taskCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(schema => {
				this.schema = schema.entity;
				return taskCollection;
			});
		}).done(taskCollection => {
			this.setState({
				tasks: taskCollection.entity._embedded.tasks,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: taskCollection.entity._links});
		});
	}

	onCreate(newTask) {
		follow(client, root, ['tasks']).then(taskCollection => {
			return client({
				method: 'POST',
				path: taskCollection.entity._links.self.href,
				entity: newTask,
				headers: {'Content-Type': 'application/json'}
			})
		}).then(response => {
			return follow(client, root, [
				{rel: 'tasks', params: {'size': this.state.pageSize}}]);
		}).done(response => {
			if (typeof response.entity._links.last !== "undefined") {
				this.onNavigate(response.entity._links.last.href);
			} else {
				this.onNavigate(response.entity._links.self.href);
			}
		});
	}
	
	onUpdate(task) {
		client({
			method: 'PATCH',
			path: task._links.self.href,
			entity: {"isDone": task.isDone, "finishDate": task.finishDate},
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(response => {
			return follow(client, root, [
				{rel: 'tasks', params: {'size': this.state.pageSize}}]);
		}).done(response => {
			if (typeof response.entity._links.last !== "undefined") {
				this.onNavigate(response.entity._links.last.href);
			} else {
				this.onNavigate(response.entity._links.self.href);
			}
		});
	}

	onDelete(task) {
		client({method: 'DELETE', path: task._links.self.href}).done(response => {
			this.loadFromServer(this.state.pageSize);
		});
	}

	onNavigate(navUri) {
		client({method: 'GET', path: navUri}).done(taskCollection => {
			this.setState({
				tasks: taskCollection.entity._embedded.tasks,
				attributes: this.state.attributes,
				pageSize: this.state.pageSize,
				links: taskCollection.entity._links
			});
		});
	}

	updatePageSize(pageSize) {
		if (pageSize !== this.state.pageSize) {
			this.loadFromServer(pageSize);
		}
	}

	componentDidMount() {
		this.loadFromServer(this.state.pageSize);
	}

	render() {
		return (
			<div>
				<CreateDialog attributes={this.state.attributes} onCreate={this.onCreate}/>
				<TaskList tasks={this.state.tasks}
							  links={this.state.links}
							  pageSize={this.state.pageSize}
							  onNavigate={this.onNavigate}
							  onUpdate={this.onUpdate}
							  onDelete={this.onDelete}
							  updatePageSize={this.updatePageSize}/>
			</div>
		)
	}
}

class CreateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		const newTask = {};
		newTask.taskDescription = ReactDOM.findDOMNode(this.refs.taskDescription).value.trim();
		newTask.creationDate = Date.now();

		this.props.onCreate(newTask);

		ReactDOM.findDOMNode(this.refs.taskDescription).value = '';

		window.location = "#";
	}

	render() {
		const input = 
			<p key='taskDescription'>
				<input type="text" placeholder='Description of the new task...' ref='taskDescription' className="field"/>
			</p>
		;

		return (
			<div>
				<a href="#addTask">Add Task</a>

				<div id="addTask" className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>New Task</h2>

						<form>
							{input}
							<button onClick={this.handleSubmit}>Add</button>
						</form>
					</div>
				</div>
			</div>
		)
	}

}

class TaskList extends React.Component {

	constructor(props) {
		super(props);
		this.handleNavFirst = this.handleNavFirst.bind(this);
		this.handleNavPrev = this.handleNavPrev.bind(this);
		this.handleNavNext = this.handleNavNext.bind(this);
		this.handleNavLast = this.handleNavLast.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}

	handleInput(e) {
		e.preventDefault();
		const pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
		if (/^[0-9]+$/.test(pageSize)) {
			this.props.updatePageSize(pageSize);
		} else {
			ReactDOM.findDOMNode(this.refs.pageSize).value =
				pageSize.substring(0, pageSize.length - 1);
		}
	}

	handleNavFirst(e){
		e.preventDefault();
		this.props.onNavigate(this.props.links.first.href);
	}

	handleNavPrev(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.prev.href);
	}

	handleNavNext(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.next.href);
	}

	handleNavLast(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.last.href);
	}

	render() {
		const tasks = this.props.tasks.map(task =>
			<Task key={task._links.self.href}
			 task={task}
			 onUpdate={this.props.onUpdate} 
			 onDelete={this.props.onDelete} />
		);

		const navLinks = [];
		if ("first" in this.props.links) {
			navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
		}
		if ("prev" in this.props.links) {
			navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
		}
		if ("next" in this.props.links) {
			navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
		}
		if ("last" in this.props.links) {
			navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
		}

		return (
			<div>
				<table>
					<tbody>
						<tr>
							<th>Description</th>
							<th>Done</th>
							<th>Created</th>
							<th>Finished</th>
							<th></th>
						</tr>
						{tasks}
					</tbody>
				</table>
				<label>Records per page </label><input ref="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput}/>
				<div>
					{navLinks}
				</div>
			</div>
		)
	}
}

class Task extends React.Component {

	constructor(props) {
		super(props);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	handleDelete() {
		this.props.onDelete(this.props.task);
	}
	
	handleInputChange(event) {
    	const target = event.target;
    	const value = target.type === 'checkbox' ? target.checked : target.value;

		this.props.task.isDone = value;
		if(value) {
			this.props.task.finishDate = Date.now();	
		} else {
			this.props.task.finishDate = null;
		}

    	this.props.onUpdate(this.props.task);
  	}
  	
  	convertTimestamp(timestamp) {
	
		// Split timestamp into [ Y, M, D, h, m, s ]
		var splittedTime = timestamp.split(/[- :T+.]/);
		
		// Apply each element to the Date function
		var date = new Date(
						Date.UTC(
							splittedTime[0],
							splittedTime[1]-1,
							splittedTime[2],
							splittedTime[3]-5,
							splittedTime[4],
							splittedTime[5])
		);
		
		//Convert to Local DateTime
		return new Intl.DateTimeFormat('es-MX', { dateStyle: 'long', timeStyle: 'medium' }).format(date);
	}

	render() {
		var creationDate = this.props.task.creationDate;
		if(creationDate != null) {
			creationDate = this.convertTimestamp(creationDate);
		}
		var finishDate = this.props.task.finishDate;
		if(finishDate != null) {
			finishDate = this.convertTimestamp(finishDate);
		}
		
		return (
			<tr>
				<td>{this.props.task.taskDescription}</td>
				<td><form><input
            			name="isDone"
            			type="checkbox"
            			checked={this.props.task.isDone}
            			onChange={this.handleInputChange} /></form></td>
				<td>{creationDate}</td>
				<td>{finishDate}</td>
				<td>
					<button onClick={this.handleDelete}>Delete</button>
				</td>
			</tr>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('react')
)

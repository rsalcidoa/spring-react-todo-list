package mx.rsalcidoa.webapp.model;

import java.util.Calendar;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
public class Task {
	
	@Id @GeneratedValue @Column(name="TASK_ID")
	private Long taskID;
	
	@Column(name = "TASK_DESC", length = 25)
	private String taskDescription;
	
	@Column(name = "DONE")
    private Boolean isDone = false;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CREATION_DATE")
    private Calendar creationDate = Calendar.getInstance();
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "FINISH_DATE")
    private Calendar finishDate;
    
	public Task() {}

	public Task(String taskDescription) {
		this.taskDescription = taskDescription;
	}

	public Long getTaskID() {
		return taskID;
	}

	public void setTaskID(Long taskID) {
		this.taskID = taskID;
	}

	public String getTaskDescription() {
		return taskDescription;
	}

	public void setTaskDescription(String taskDescription) {
		this.taskDescription = taskDescription;
	}

	public Boolean getIsDone() {
		return isDone;
	}

	public void setIsDone(Boolean isDone) {
		this.isDone = isDone;
	}

	public Calendar getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Calendar creationDate) {
		this.creationDate = creationDate;
	}

	public Calendar getFinishDate() {
		return finishDate;
	}

	public void setFinishDate(Calendar finishDate) {
		this.finishDate = finishDate;
	}

	@Override
	public int hashCode() {
		return Objects.hash(creationDate, finishDate, isDone, taskDescription, taskID);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Task other = (Task) obj;
		return Objects.equals(creationDate, other.creationDate) 
				&& Objects.equals(finishDate, other.finishDate)
				&& Objects.equals(isDone, other.isDone) 
				&& Objects.equals(taskDescription, other.taskDescription)
				&& Objects.equals(taskID, other.taskID);
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("Task [taskID=").append(taskID)
				.append(", taskDescription=").append(taskDescription)
				.append(", isDone=").append(isDone)
				.append(", creationDate=").append(creationDate)
				.append(", finishDate=").append(finishDate)
				.append("]");
		return builder.toString();
	}

}
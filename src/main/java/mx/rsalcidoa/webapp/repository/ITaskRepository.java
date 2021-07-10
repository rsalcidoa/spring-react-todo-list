package mx.rsalcidoa.webapp.repository;

import org.springframework.data.repository.CrudRepository;

import mx.rsalcidoa.webapp.model.Task;

public interface ITaskRepository extends CrudRepository<Task, Long> {

}
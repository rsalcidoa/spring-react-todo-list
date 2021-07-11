package mx.rsalcidoa.webapp.repository;

import org.springframework.data.repository.PagingAndSortingRepository;

import mx.rsalcidoa.webapp.model.Task;

public interface ITaskRepository extends PagingAndSortingRepository<Task, Long> {

}
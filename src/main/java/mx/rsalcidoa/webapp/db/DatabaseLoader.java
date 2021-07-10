package mx.rsalcidoa.webapp.db;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import mx.rsalcidoa.webapp.model.Task;
import mx.rsalcidoa.webapp.repository.ITaskRepository;

@Component
public class DatabaseLoader implements CommandLineRunner {
	
	private final ITaskRepository taskRepo;

	@Autowired
	public DatabaseLoader(ITaskRepository taskRepo) {
		this.taskRepo = taskRepo;
	}

	@Override
	public void run(String... args) throws Exception {

		this.taskRepo.save(new Task("Task 1"));
	}

}
package mx.rsalcidoa.webapp;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import mx.rsalcidoa.webapp.model.Task;
import mx.rsalcidoa.webapp.repository.ITaskRepository;

@DataJpaTest
class TaskRepositoryTests {

	@Autowired
	TestEntityManager entityManager;
	
	@Autowired
	ITaskRepository iTaskRepository;
	
	@Test
	void whenSaveTask_thenReturnSavedTask() {

		Task testTask = new Task("This is a save test task");
	    entityManager.persist(testTask);
	    entityManager.flush();

	    Task saved = iTaskRepository.save(testTask);

	    assertNotNull(saved);
	}
	
	@Test
	void whenfindTask_thenReturnTask() {

		Task testTask = new Task("This is a find test task");
	    entityManager.persist(testTask);
	    entityManager.flush();

	    Optional<Task> found = iTaskRepository.findById(testTask.getTaskID());

	    assertEquals(testTask, found.get());
	}
	
	@Test
	void whenUpdateTask_thenCheckUpdate() {

		String originalDesc = "This is a test task";
		
		Task testTask = new Task("This is a test task");
	    entityManager.persist(testTask);
	    entityManager.flush();

	    testTask = iTaskRepository.save(testTask);
	    
	    testTask.setTaskDescription("This is a updated test task");
	    
	    testTask = iTaskRepository.save(testTask);

	    assertNotEquals(originalDesc, testTask.getTaskDescription());
	}
	
	@Test
	void whenDeleteById_thenFindById() {
		
		Task testTask = new Task("This is a save test task");
	    entityManager.persist(testTask);
	    entityManager.flush();

	    iTaskRepository.deleteById(testTask.getTaskID());
	    
	    assertTrue(iTaskRepository.findById(testTask.getTaskID()).isEmpty());
	}
	
}

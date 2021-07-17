package mx.rsalcidoa.webapp;

import static org.hamcrest.CoreMatchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import mx.rsalcidoa.webapp.model.Task;
import mx.rsalcidoa.webapp.repository.ITaskRepository;

@SpringBootTest(
	webEnvironment = SpringBootTest.WebEnvironment.MOCK,
	classes = SpringReactTodoListApplication.class) 
@AutoConfigureMockMvc
class SpringReactTodoListApplicationTests {

	@Autowired
    private MockMvc mvc;

	@Autowired
	ITaskRepository iTaskRepository;

	@DynamicPropertySource
	static void dynamicProperties(DynamicPropertyRegistry registry) {
		registry.add("spring.datasource.url", () -> "jdbc:h2:mem:testdb");
	}

	@Value("${base.url}")
	private String baseUrl;
	
	String currentTaskUrl = "$._links.self.href";
	
	@Test
	void whenGetTasks_thenStatus200() throws Exception {

		mvc.perform(get(baseUrl)
			.contentType(MediaType.APPLICATION_JSON))
	    	.andExpect( status().isOk() )
	    	.andExpect( content().contentTypeCompatibleWith(new MediaType("application", "*+json")) )
	    	.andExpect( jsonPath( currentTaskUrl, is( baseUrl ) ) );
	}
	
	@Test
	void whenGetTask_thenStatus200() throws Exception {

		String urlOfExistingTask = baseUrl + "/1";
		
		mvc.perform(get(urlOfExistingTask)
			.contentType(MediaType.APPLICATION_JSON))
	    	.andExpect( status().isOk() )
	    	.andExpect( content().contentTypeCompatibleWith(new MediaType("application", "*+json")) )
	    	.andExpect( jsonPath( currentTaskUrl, is( urlOfExistingTask ) ) );
	}
	
	@Test
	void whenPostTask_thenStatus200() throws Exception {

		Task newTask = new Task("This is a new Task");
		newTask.setTaskID(2L);
		
		String urlOfCreatedTask = baseUrl + "/" + newTask.getTaskID();
		
		mvc.perform(post(baseUrl)
			.content(new ObjectMapper().writeValueAsString(newTask))
			.contentType(MediaType.APPLICATION_JSON)
			.accept(MediaType.APPLICATION_JSON))
	    	.andExpect( status().isCreated() )
	    	.andExpect( content().contentTypeCompatibleWith(new MediaType("application", "*+json")) )
	    	.andExpect( jsonPath( currentTaskUrl, is( urlOfCreatedTask ) ) );
	}

	@Test
	void whenDelTask_thenStatus200() throws Exception {

		String urlOfDeletedTask = baseUrl + "/1";
		
		mvc.perform(delete(urlOfDeletedTask)
			.contentType(MediaType.APPLICATION_JSON))
	    	.andExpect( status().isNoContent() );
	}

}

package mx.rsalcidoa.webapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class TaskController {
	
	@RequestMapping(value = "/")
	public String index() {
		return "index";
	}
}

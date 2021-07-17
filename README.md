# To-Do List Web App with Spring and React

### This is a basic project for CRUD operations of a To-Do List trought a RESTful API. 

The project was made using Spring Boot for backend and React.js in the frontend.

Before running, be sure to have installed Node.js and Java 8+ in your machine, also from the ```src\main\js\to-do-list``` directory rename the ```.env.sample``` file to ```.env```.

Once copied to a local directory and opened in your favorite editor, you can run the project on the default environment, using the following maven command:

```mvnw clean install spring-boot:run```

--------------------------------------------------

### For another environments follow the next steps:
* Rename the ```.env.sample``` file to ```.env``` in ```\src\main\js\to-do-list``` (If you didn't do it already).
* Be sure that the API URL from the ```.env``` file matchs with the ```base.url``` property in the ```src\main\resources\application-[environment].properties``` file.
* Finally you can run the project with the next maven command:

```mvnw clean package -P [environment] install spring-boot:run```

Note: [environment] accepts dev, test or prod as values.

Greetings!

package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.UserServiceImpl;
import ru.kata.spring.boot_security.demo.util.PersonErrorResponse;
import ru.kata.spring.boot_security.demo.util.PersonNotCreatedException;
import ru.kata.spring.boot_security.demo.util.PersonNotFoundException;


import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class PeopleController {
    private final UserServiceImpl userService;

    @Autowired
    public PeopleController(UserServiceImpl userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        System.out.println("метод из REST");
        return userService.getAllUsers();
    }

    @GetMapping("/users/{id}")
    public User getUser(@PathVariable("id") int id) {
        if (userService.getUserById(id) == null) {
            throw new PersonNotFoundException("User not found!!!");
        } else
            return userService.getUserById(id);
    }

    @PostMapping("/users")
    public ResponseEntity<HttpStatus> create(@RequestBody @Valid User user, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            StringBuilder errorMessage = new StringBuilder();

            List<FieldError> errors = bindingResult.getFieldErrors();
            for (FieldError error : errors) {
                errorMessage.append(error.getField())
                        .append(" - ")
                        .append(error.getDefaultMessage())
                        .append(";");
            }
            throw new PersonNotCreatedException(errorMessage.toString());
        }

        userService.saveToDB(user);

        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PutMapping("/users")
    public void updateUser(@RequestBody User user) {
        userService.update(user.getId(), user);

    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable int id) {
        userService.delete(userService.getUserById(id)); // Предполагается, что метод delete принимает ID
    }


}

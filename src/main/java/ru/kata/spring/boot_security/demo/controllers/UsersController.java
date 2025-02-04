package ru.kata.spring.boot_security.demo.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.repositories.RoleRepository;
import ru.kata.spring.boot_security.demo.service.UserServiceImpl;

import java.security.Principal;

@Controller
public class UsersController {

    private final UserServiceImpl userService;

    @Autowired
    public UsersController(UserServiceImpl userDaoImpl) {
        this.userService = userDaoImpl;
    }

    @GetMapping("/")
    public String index() {
        return "/index";
    }


    @GetMapping("/admin")
    public String adminPage(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.getUserByName(username);
        model.addAttribute("user", user);
        return "/people/admin";
    }

    @GetMapping("/user")
    public String userPage(Model model, Principal principal) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.getUserByName(username);
        model.addAttribute("user", user);

        if (principal == null) {
            System.out.println("Principal is null");
            return "redirect:/login"; // или другая страница
        }
        String email = principal.getName();

        User currentUser = userService.getUserByName(email);
        model.addAttribute("currentUser", currentUser);
        model.addAttribute("currentRoles", currentUser.getRolesAsText());
        return "/people/user";
    }
}
package ru.kata.spring.boot_security.demo.controllers;


import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.repositories.RoleRepository;
import ru.kata.spring.boot_security.demo.service.UserServiceImpl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Controller
public class UsersController {

    private final UserServiceImpl userService;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    @Autowired
    public UsersController(UserServiceImpl userDaoImpl, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.userService = userDaoImpl;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/admin")
    public String admin(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.getUserByName(username);
        List<Role> allRoles = roleRepository.findAll();
        model.addAttribute("allRoles", allRoles);
        model.addAttribute("people", userService.getAllUsers());
        model.addAttribute("user", user);
        return "people/admin/admin";
    }


    @GetMapping("/admin/show_all")
    public String index(Model model) {
        model.addAttribute("people", userService.getAllUsers());
        return "people/admin/all_users";
    }

    @GetMapping("/user")
    public String user(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.getUserByName(username);
        model.addAttribute("user", user);
        return "people/user";
    }

    @GetMapping("/show")
    public String showUser(@RequestParam("id") int id, Model model) {
        User user = userService.getUserById(id);
        model.addAttribute("user", user);
        return "people/user";
    }

    @GetMapping("/admin/new")
    public String newPerson(Model model) {
        model.addAttribute("user", new User());
        List<Role> allRoles = roleRepository.findAll();
        model.addAttribute("allRoles", allRoles);
        return "people/admin/admin";
    }

    @PostMapping("/")
    public String create(@ModelAttribute("user") @Valid User user, BindingResult bindingResult,
                         @RequestParam("selectedRoles") List<Integer> selectedRoleIds) {
        if (bindingResult.hasErrors()) {
            return "people/admin/new";
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Set<Role> allRoles = new HashSet<>();
        if (selectedRoleIds != null) {
            for (Integer roleId : selectedRoleIds) {
                Role role = roleRepository.getById(roleId);
                allRoles.add(role);
            }
        }
        user.setRoles(allRoles);
        userService.save(user);
        return "redirect:/admin";
    }

    @GetMapping("/admin/edit")
    public String edit(Model model, @RequestParam("id") int id) {
        List<Role> allRoles = roleRepository.findAll();
        model.addAttribute("user", userService.getUserById(id));
        model.addAttribute("allRoles", allRoles);
        return "people/admin/edit";
    }

    @PatchMapping("/admin/update")
    public String update(@ModelAttribute("user") @Valid User user,
                         BindingResult bindingResult,
                         @RequestParam("id") int id,
                         @RequestParam("selectedRoles") List<Integer> selectedRoleIds) {
        if (bindingResult.hasErrors()) {
            return "people/admin/edit";
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Set<Role> allRoles = new HashSet<>();
        if (selectedRoleIds != null) {
            for (Integer roleId : selectedRoleIds) {
                Role role = roleRepository.getById(roleId);
                allRoles.add(role);
            }
        }
        user.setRoles(allRoles);
        userService.update(id, user);
        return "redirect:/admin/show_all";
    }

    @DeleteMapping("/admin/delete")
    public String delete(@RequestParam("id") int id) {
        userService.delete(userService.getUserById(id));
        return "redirect:/admin";
    }

    @GetMapping("/index2")
    public String index2() {
        return "/people/index2";
    }
}
package ru.kata.spring.boot_security.demo.controllers;


import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.UserServiceImpl;

@Controller
public class UsersController {

    private final UserServiceImpl userService;

    @Autowired
    public UsersController(UserServiceImpl userDaoImpl) {
        this.userService = userDaoImpl;
    }

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/admin/show_all")
    public String index(Model model) {
        model.addAttribute("people", userService.getAllUsers());
        return "people/admin/index";
    }

    @GetMapping("/user")
    public String show(Model model) {
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
    public String newPerson(@ModelAttribute("user") User user) {
        return "people/admin/new";
    }

    @PostMapping()
    public String create(@ModelAttribute("user") @Valid User user, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "people/admin/new";
        }
        userService.save(user);
        return "redirect:/";
    }

    @GetMapping("/edit")
    public String edit(Model model, @RequestParam("id") int id) {
        model.addAttribute("user", userService.getUserById(id));
        return "people/admin/edit";
    }

    @PatchMapping("/update")
    public String update(@ModelAttribute("user") @Valid User user,
                         BindingResult bindingResult,
                         @RequestParam("id") int id) {
        if (bindingResult.hasErrors()) {
            return "people/admin/edit";
        }
        userService.update(id, user);
        System.out.println(user);
        return "redirect:/";
    }

    @DeleteMapping("/delete")
    public String delete(@RequestParam("id") int id) {
        userService.delete(userService.getUserById(id));
        return "redirect:/admin/show_all";
    }
}
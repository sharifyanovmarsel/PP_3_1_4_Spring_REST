package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.repositories.UsersRepository;

import javax.transaction.Transactional;
import java.util.Collections;
import java.util.List;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UsersRepository usersRepository;

    @Autowired
    public UserServiceImpl(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    public User getUserByName(String username) {
        return usersRepository.findByName(username);
    }

    public User getUserByEmail(String email) {
        return usersRepository.findByEmail(email);
    }

    @Override
    public List<User> getAllUsers() {
        System.out.println("Полученные пользователи: " + usersRepository.findAll());
        return usersRepository.findAll();
    }

    @Override
    public User getUserById(int id) {
        if (usersRepository.findById(id).isPresent()) {
            return usersRepository.findById(id).get();
//        } else throw new UsernameNotFoundException("User not found");
        }return null;
        }

    @Transactional
    @Override
    public void update(int id, User updatedUser) {
        if (usersRepository.findById(id).isPresent()) {
            usersRepository.save(updatedUser);}
    }

    @Transactional
    @Override
    public void save(User user) {
        User userFromBD = usersRepository.findByName(user.getName());
        if (userFromBD == null) {
            user.setPassword(user.getPassword());
            usersRepository.save(user);
        }
    }

    @Transactional
    @Override
    public void delete(User user) {
        if (usersRepository.findById(user.getId()).isPresent()) {
            usersRepository.delete(user);
        }
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = usersRepository.findByEmail(email);

        if (user == null) {
            throw new UsernameNotFoundException("User not found!!!");
        }
        return user;
    }

    @org.springframework.transaction.annotation.Transactional
    public void saveToDB(User user) {
        usersRepository.save(user);
    }
}

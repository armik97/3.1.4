package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.model.UserDTO;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> getAllUsers();


    Optional<User> findByUsername(String username);

    User findUserById(Long id);

    void update(User user);

    void add(User user);

    void saveUser(UserDTO user);

    void editUser(UserDTO user);

    void delete(Long id);

}

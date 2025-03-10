package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.model.UserDTO;
import ru.kata.spring.boot_security.demo.repositories.UserRepository;


import java.util.List;
import java.util.Optional;
import java.util.Set;


@Service
public class UserServiceImp implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final Convertor convertor;

    @Autowired
    public UserServiceImp(UserRepository userRepository, PasswordEncoder passwordEncoder,
                          Convertor convertor) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.convertor = convertor;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь с таким ID не найден"));
    }

    @Transactional
    @Override
    public void update(User updatedUser) {
        userRepository.save(updatedUser);
    }

    @Transactional
    @Override
    public void add(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    @Transactional
    @Override
    public void saveUser(UserDTO userDTO) {
        User user = new User();
        user.setName(userDTO.getName());
        user.setLastname(userDTO.getLastname());
        user.setAge(userDTO.getAge());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        Set<Role> roles = convertor.stringToSet(userDTO.getRoles());
        user.setRoles(roles);

        userRepository.save(user);
    }

    @Transactional
    @Override
    public void editUser(UserDTO userDTO) {
        User user = userRepository.findById((long) userDTO.getId())
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));

        user.setName(userDTO.getName());
        user.setLastname(userDTO.getLastname());
        user.setAge(userDTO.getAge());
        user.setEmail(userDTO.getEmail());

        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        Set<Role> roles = convertor.stringToSet(userDTO.getRoles());
        user.setRoles(roles);

        userRepository.save(user);
    }

    @Transactional
    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}

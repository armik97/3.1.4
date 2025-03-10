package ru.kata.spring.boot_security.demo.init;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.HashSet;
import java.util.Set;

@Component
public class TestDataInitializer implements ApplicationRunner {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public TestDataInitializer(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {

        Role userRole = roleService.findByRole("ROLE_USER").orElseGet(() -> {
            Role newUserRole = new Role("ROLE_USER");
            roleService.saveRole(newUserRole);
            return newUserRole;
        });

        Role adminRole = roleService.findByRole("ROLE_ADMIN").orElseGet(() -> {
            Role newAdminRole = new Role("ROLE_ADMIN");
            roleService.saveRole(newAdminRole);
            return newAdminRole;
        });

        if (userService.findByUsername("user").isEmpty()) {
            Set<Role> userRoles = new HashSet<>();
            userRoles.add(userRole);

            User user = new User();
            user.setUsername("user");
            user.setPassword("user");
            user.setName("Marshall");
            user.setLastname("Mathers");
            user.setEmail("marshall@mail.ru");
            user.setAge(30);
            user.setRoles(userRoles);

            userService.add(user);
        }

        if (userService.findByUsername("admin").isEmpty()) {
            Set<Role> adminRoles = new HashSet<>();
            adminRoles.add(adminRole);
            adminRoles.add(userRole);

            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword("admin");
            admin.setName("Andrea");
            admin.setLastname("Bocelli");
            admin.setEmail("andrea@mail.ru");
            admin.setAge(35);
            admin.setRoles(adminRoles);

            userService.add(admin);
        }
    }
}
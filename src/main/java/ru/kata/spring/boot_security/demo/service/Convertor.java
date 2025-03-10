package ru.kata.spring.boot_security.demo.service;

import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;

import java.util.HashSet;
import java.util.Set;

@Component
public class Convertor {

    private final RoleService roleService;

    public Convertor(RoleService roleService) {
        this.roleService = roleService;
    }

    public Set<Role> stringToSet(Set<String> roles) {
        Set<Role> rolesToReturn = new HashSet<>();

        for (String role : roles) {
            Role existingRole = roleService.findByRole("ROLE_" + role)
                    .orElse(null);

            if (existingRole != null) {
                rolesToReturn.add(existingRole);
            } else {
                Role newRole = new Role("ROLE_" + role);
                rolesToReturn.add(newRole);
            }
        }
        return rolesToReturn;
    }

}

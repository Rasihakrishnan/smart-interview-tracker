package com.example.smartinterviewpreparationtracker.Service;

import com.example.smartinterviewpreparationtracker.Entity.User;
import com.example.smartinterviewpreparationtracker.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UserService {

    @Autowired
    private UserRepository Userrepo;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public User register(User user) {

        user.setPassword(encoder.encode(user.getPassword()));

        return Userrepo.save(user);
    }

public User login(String email, String password) {

    User user = Userrepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

    if (!encoder.matches(password, user.getPassword())) {
        throw new RuntimeException("Invalid password");
    }

    return user;
}
}

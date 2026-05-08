package com.example.smartinterviewpreparationtracker.Entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Problem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String difficulty; // Easy, Medium, Hard
    private String topic;      // Array, DP, Graph
    private String status;     // Solved / Not Solved
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}
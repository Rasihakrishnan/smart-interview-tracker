package com.example.smartinterviewpreparationtracker.Repository;

import com.example.smartinterviewpreparationtracker.Entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProblemRepository extends JpaRepository<Problem, Long> {

    List<Problem> findByUser_Id(Long userId);

}

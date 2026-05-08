package com.example.smartinterviewpreparationtracker.Controller;

import com.example.smartinterviewpreparationtracker.Entity.Problem;
import com.example.smartinterviewpreparationtracker.Service.ProblemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@CrossOrigin(origins="*")
@RestController   // 🔥 VERY IMPORTANT
@RequestMapping("/problems")  // base URL
public class ProblemController {

    @Autowired
    private ProblemService service;

    @PutMapping("/{id}")
    public Problem updateStatus(@PathVariable Long id,
                                @RequestParam String status) {
        return service.updateStatus(id, status);
    }
    @GetMapping("/problems/{userId}")
    public List<Problem> getProblems(@PathVariable Long userId) {
        return service.getByUserId(userId);
    }
    @GetMapping("/stats/{userId}")
    public Map<String, Object> getStats(@PathVariable Long userId) {
        return service.getStats(userId);
    }
    @DeleteMapping("/{id}")
    public void deleteProblem(@PathVariable Long id) {
       service.deleteById(id);
    }

    @PostMapping("/addproblem")
    public ResponseEntity<Problem> addProblem(
            @RequestBody Problem problem) {

        Problem savedProblem = service.addProblem(problem);
        return new ResponseEntity<>(savedProblem, HttpStatus.CREATED);
    }
}
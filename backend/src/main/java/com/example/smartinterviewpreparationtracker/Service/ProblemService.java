package com.example.smartinterviewpreparationtracker.Service;

import com.example.smartinterviewpreparationtracker.Entity.Problem;
import com.example.smartinterviewpreparationtracker.Entity.User;
import com.example.smartinterviewpreparationtracker.Repository.ProblemRepository;
import com.example.smartinterviewpreparationtracker.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProblemService {

    @Autowired
    private ProblemRepository repo;

    @Autowired
    private UserRepository userRepo;

    // ➕ Add Problem
    public Problem addProblem(Problem problem) {
        long userId=problem.getUser().getId();
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        problem.setUser(user);
        return repo.save(problem);
    }

    // 📄 Get Problems
    public List<Problem> getProblems(Long userId) {
        return repo.findByUser_Id(userId);
    }

    // ✏️ Update Status
    public Problem updateStatus(Long id, String status) {

        Problem problem = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        problem.setStatus(status);

        return repo.save(problem);
    }
    public Map<String, Object> getStats(Long userId) {

        List<Problem> problems = repo.findByUser_Id(userId);

        int solved = 0;
        int unsolved = 0;

        int easy = 0;
        int medium = 0;
        int hard = 0;

        Map<String, Integer> topics = new HashMap<>();

        for (Problem p : problems) {

            // ✅ Solved / Unsolved
            if ("Solved".equals(p.getStatus())) {
                solved++;
            } else {
                unsolved++;
            }

            // ✅ Difficulty count
            switch (p.getDifficulty()) {
                case "Easy": easy++; break;
                case "Medium": medium++; break;
                case "Hard": hard++; break;
            }

            // ✅ Topic count
            topics.put(
                    p.getTopic(),
                    topics.getOrDefault(p.getTopic(), 0) + 1
            );
        }

        // 🤖 Recommendation (weakest topic)
        String weakTopic = topics.entrySet()
                .stream()
                .min(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("None");

        Map<String, Object> result = new HashMap<>();

        result.put("totalSolved", solved);
        result.put("totalUnsolved", unsolved);
        result.put("easy", easy);
        result.put("medium", medium);
        result.put("hard", hard);
        result.put("topics", topics);
        result.put("recommendation", "Practice more " + weakTopic);

        return result;
    }

    public void deleteById(Long id) {

        // 1. Check if problem exists
        Problem problem = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        // 2. Delete the problem
        repo.delete(problem);
    }

    public List<Problem> getByUserId(Long userId) {
        return repo.findByUser_Id(userId);
    }
}

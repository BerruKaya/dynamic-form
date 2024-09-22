package com.project.dynamic_form_backend.controller;

import com.project.dynamic_form_backend.document.FormSubmission;
import com.project.dynamic_form_backend.service.FormSubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
public class FormSubmissionController {

    @Autowired
    private FormSubmissionService formSubmissionService;

    @PostMapping
    public ResponseEntity<FormSubmission> submitForm(@RequestBody FormSubmission submission) {
        FormSubmission savedSubmission = formSubmissionService.saveFormSubmission(submission);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSubmission);
    }

    @GetMapping
    public List<FormSubmission> getAllSubmissions() {
        return formSubmissionService.getAllSubmissions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FormSubmission> getSubmissionById(@PathVariable String id) {
        FormSubmission submission = formSubmissionService.getSubmissionById(id);
        if (submission != null) {
            return ResponseEntity.ok(submission);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteForm(@PathVariable String id) {
        formSubmissionService.deleteForm(id);
        return ResponseEntity.noContent().build();
    }

}

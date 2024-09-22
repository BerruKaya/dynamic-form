package com.project.dynamic_form_backend.service;

import com.project.dynamic_form_backend.document.FormSubmission;
import com.project.dynamic_form_backend.repository.FormSubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FormSubmissionService {

    @Autowired
    private FormSubmissionRepository formSubmissionRepository;

    public FormSubmission saveFormSubmission(FormSubmission submission) {
        return formSubmissionRepository.save(submission);
    }

    public List<FormSubmission> getAllSubmissions() {
        return formSubmissionRepository.findAll();
    }

    public FormSubmission getSubmissionById(String id) {
        return formSubmissionRepository.findById(id).orElse(null);
    }

    public void deleteForm(String id) {
        formSubmissionRepository.deleteById(id);
    }
}


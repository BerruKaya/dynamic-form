package com.project.dynamic_form_backend.repository;

import com.project.dynamic_form_backend.document.FormSubmission;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FormSubmissionRepository extends MongoRepository<FormSubmission,String> {
}

package com.project.dynamic_form_backend.repository;

import com.project.dynamic_form_backend.document.Form;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormRepository extends MongoRepository<Form, String> {


}

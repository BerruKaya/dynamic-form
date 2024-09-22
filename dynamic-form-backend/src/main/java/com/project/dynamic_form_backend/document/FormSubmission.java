package com.project.dynamic_form_backend.document;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Map;

@Document(collection = "formSubmissions")
@Data
public class FormSubmission {
    @Id
    private String id;
    private String formId;
    private Map<String, Object> formData;  // Keys are element names, values are user inputs

}

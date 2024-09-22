package com.project.dynamic_form_backend.document;

import java.util.List;
import com.project.dynamic_form_backend.model.FormElement;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "forms")
@Data
public class Form {

    @Id
    private String id;
    private String name;
    private String description;
    private List<FormElement> elements;



}

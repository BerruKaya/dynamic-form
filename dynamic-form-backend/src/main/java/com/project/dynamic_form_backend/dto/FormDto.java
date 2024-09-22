package com.project.dynamic_form_backend.dto;
import lombok.Data;

import java.util.List;

@Data
public class FormDto {
    private String id;
    private String name;
    private List<FormElementDTO> elements;

}

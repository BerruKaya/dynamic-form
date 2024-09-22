package com.project.dynamic_form_backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class FormElementDTO {
    private String type;
    private String label;
    private String name;
    private String placeholder;
    private boolean required;
    private List<String> options;
}

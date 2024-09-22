package com.project.dynamic_form_backend.model;

import lombok.Data;

import java.util.List;

@Data
public class FormElement {

    private String type; // e.g., "text", "checkbox", "radio"
    private String label;
    private String name;
    private String placeholder;
    private boolean required;
    private List<String> options; // For select, radio, checkbox elements

    // Getters and Setters
}


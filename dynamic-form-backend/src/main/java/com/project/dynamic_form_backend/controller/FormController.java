package com.project.dynamic_form_backend.controller;

import com.project.dynamic_form_backend.document.Form;
import com.project.dynamic_form_backend.service.FormService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forms")
public class FormController {

    @Autowired
    private FormService formService;
    @PostMapping
    public ResponseEntity<Form> createForm(@RequestBody Form form) {
        Form createdForm = formService.createForm(form);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdForm);
    }

    @GetMapping
    public ResponseEntity<List<Form>> getAllForms() {
        List<Form> forms = formService.getAllForms(); // Implement this method in FormService
        return ResponseEntity.ok(forms);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Form> getFormById(@PathVariable String id) {
        Form form = formService.getFormById(id);
        if (form != null) {
            return ResponseEntity.ok(form);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<Form> updateForm(@PathVariable String id, @RequestBody Form updatedForm) {
        Form form = formService.updateForm(id, updatedForm);
        if (form != null) {
            return ResponseEntity.ok(form);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteForm(@PathVariable String id) {
        formService.deleteForm(id);
        return ResponseEntity.noContent().build();
    }
}

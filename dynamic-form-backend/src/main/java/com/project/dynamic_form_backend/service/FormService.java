package com.project.dynamic_form_backend.service;
import com.project.dynamic_form_backend.document.Form;
import com.project.dynamic_form_backend.repository.FormRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FormService {

    @Autowired
    private FormRepository formRepository;

    public FormService(FormRepository formRepository) {
        this.formRepository = formRepository;
    }

    public Form createForm(Form form) {
        return formRepository.save(form);
    }

    public List<Form> getAllForms() {
        return formRepository.findAll();
    }
    public Form getFormById(String id){
        return formRepository.findById(id).orElse(null);
    }
    public Form updateForm(String id, Form updatedForm) {
        // Find the existing form by its ID
        Form existingForm = formRepository.findById(id).orElse(null);
        if (existingForm != null) {
            // Update fields of the existing form with the new values
            existingForm.setName(updatedForm.getName());
            existingForm.setDescription(updatedForm.getDescription());
            existingForm.setElements(updatedForm.getElements());

            // Save and return the updated form
            return formRepository.save(existingForm);
        } else {
            // Optionally handle the case where the form does not exist
            // Return null or throw an exception
            return null;
        }
    }

    public void deleteForm(String id) {
        formRepository.deleteById(id);
    }

}

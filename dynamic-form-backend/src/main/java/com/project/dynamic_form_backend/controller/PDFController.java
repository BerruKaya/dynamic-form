package com.project.dynamic_form_backend.controller;
import com.project.dynamic_form_backend.PDFGenerator;
import com.project.dynamic_form_backend.document.Form;
import com.project.dynamic_form_backend.model.FormElement;
import com.project.dynamic_form_backend.service.FormService;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;
@RestController
@RequestMapping("/api/pdf")
public class PDFController {

    @Autowired
    private FormService formService; // Assuming you have a service to get form data

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportFormToPDF(@RequestParam String formId) throws IOException {
        // Fetch form data by formId
        Form form = formService.getFormById(formId);

        // Create PDF content
        byte[] pdfBytes = createPDF(form);

        // Create response with PDF
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "form_" + formId + ".pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    private byte[] createPDF(Form form) throws IOException {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PDDocument document = new PDDocument();
            PDPage page = new PDPage();
            document.addPage(page);

            PDPageContentStream contentStream = new PDPageContentStream(document, page);
            contentStream.beginText();
            contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);
            contentStream.newLineAtOffset(25, 750); // Set the initial position at top of page

            // Add form title
            contentStream.showText("Form Title: " + form.getName());
            contentStream.newLineAtOffset(0, -20); // Move down after title

            // Set a starting vertical offset for form elements
            float yPosition = 725;

            // Add form fields
            for (FormElement element : form.getElements()) {
                // Explicitly set the Y position and reset X
                contentStream.newLineAtOffset(0, -20); // Move down for the next line

                // Create the text for each form element based on its type
                String elementText = element.getLabel();
                contentStream.newLine();

                // Include additional details based on the type of form element
                switch (element.getType()) {
                    case "text":
                    case "textarea":
                    case "number":
                    case "email":
                        if (element.getPlaceholder() != null && !element.getPlaceholder().isEmpty()) {
                            elementText += element.getPlaceholder();
                        }
                        contentStream.showText(elementText); // Output the text
                        break;
                    case "select":
                        if (element.getOptions() != null && !element.getOptions().isEmpty()) {
                            elementText += " : " + String.join(", ", element.getOptions());
                        }
                        contentStream.showText(elementText);
                        break;
                    case "checkbox":
                        contentStream.showText(elementText);
                        break;
                    case "radio":
                        if (element.getOptions() != null && !element.getOptions().isEmpty()) {
                            elementText += " : " + String.join(", ", element.getOptions());
                        }
                        contentStream.showText(elementText);
                        break;
                    case "date":
                        contentStream.showText(elementText);
                        break;
                    default:
                        elementText += " - Unknown type";
                        contentStream.showText(elementText);
                        break;
                }

                // Move the position for the next element
                yPosition -= 20;

                // Check for page overflow and add new page if needed
                if (yPosition < 50) { // Check if we need a new page
                    contentStream.endText();
                    contentStream.close();
                    PDPage newPage = new PDPage();
                    document.addPage(newPage);
                    contentStream = new PDPageContentStream(document, newPage);
                    contentStream.beginText();
                    contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);
                    contentStream.newLineAtOffset(25, 750); // Reset position for new page
                    yPosition = 725; // Reset yPosition for new page
                }
            }

            contentStream.endText();
            contentStream.close();

            // Save the document to the output stream
            document.save(outputStream);
            document.close();

            return outputStream.toByteArray(); // Return the PDF as a byte array
        }
    }


}

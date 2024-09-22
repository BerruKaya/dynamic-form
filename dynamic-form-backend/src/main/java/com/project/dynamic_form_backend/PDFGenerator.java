package com.project.dynamic_form_backend;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

import java.io.IOException;
import java.util.Map;

public class PDFGenerator {

    public void createPdf(String formId, Map<String, String> formData) {
        PDDocument document = new PDDocument();
        PDPage page = new PDPage();
        document.addPage(page);

        try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
            contentStream.beginText();
            contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);
            contentStream.newLineAtOffset(25, 750);

            contentStream.showText("Form ID: " + formId);
            contentStream.newLine();
            for (Map.Entry<String, String> entry : formData.entrySet()) {
                contentStream.showText(entry.getKey() + ": " + entry.getValue());
                contentStream.newLine();
            }

            contentStream.endText();
        } catch (IOException e) {
            e.printStackTrace();
        }

        try {
            document.save("Form-" + formId + ".pdf");
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                document.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}

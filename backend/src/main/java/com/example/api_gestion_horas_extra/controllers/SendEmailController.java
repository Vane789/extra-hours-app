package com.example.api_gestion_horas_extra.controllers;

import com.example.api_gestion_horas_extra.entity.EmailRequest;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.io.ByteArrayInputStream;
import java.io.IOException;

import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api")
public class SendEmailController {
    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/send-email")
    public ResponseEntity<String> sendEmail(@RequestBody EmailRequest emailRequest) {
        try {
            System.out.println("Email: " + emailRequest.getEmail());
            System.out.println("File size: " + (emailRequest.getFile() != null ? emailRequest.getFile().length : 0));

            if (emailRequest.getFile() == null || emailRequest.getFile().length == 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El archivo adjunto está vacío.");
            }

            if (emailRequest.getEmail() == null || emailRequest.getEmail().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El correo del destinatario está vacío.");
            }

            sendMailWithAttachment(emailRequest.getEmail(), emailRequest.getFile());
            return ResponseEntity.status(HttpStatus.OK).body("Correo enviado con éxito");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al enviar el correo");
        }
    }

    private void sendMailWithAttachment(String recipient, byte[] fileContent) throws MessagingException, IOException {
        if (fileContent == null || fileContent.length == 0) {
            throw new MessagingException("El archivo adjunto está vacío.");
        }

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

        // Aquí usas el correo estático
        helper.setFrom("vane789vane@hotmail.com"); // Correo estático
        helper.setTo(recipient);
        helper.setSubject("Reporte de Horas Extras");
        helper.setText("Adjunto encontrarás el reporte de horas extras.");

        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(fileContent);
        helper.addAttachment("Reporte_Horas_Extras.xlsx", new ByteArrayDataSource(byteArrayInputStream,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));

        mailSender.send(mimeMessage);
    }

}

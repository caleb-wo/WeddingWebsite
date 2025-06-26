package dev.calebwolfe.project.wedding.weddingwebsite.Error;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Data
public class ErrorDetails {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss")
    private LocalDateTime timestamp;
    private HttpStatus status;
    private String details; // More specific error details.
    private String error; // Error phrase.
    private String path; // Culprit, or URL that caused the problem.

    public ErrorDetails() {
        this.timestamp = LocalDateTime.now();
    }

    public ErrorDetails(HttpStatus status, String details, String path){
        this();
        this.status = status;
        this.error = status.getReasonPhrase();
        this.details = details;
        this.path = path;
    }
}
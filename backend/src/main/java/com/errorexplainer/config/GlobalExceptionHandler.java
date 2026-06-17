package com.errorexplainer.config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException ex) {
        String message = ex.getMessage();
        if (message != null && message.contains("Groq")) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Groq API error: " + message
            ));
        }
        return ResponseEntity.internalServerError().body(Map.of(
            "message", message != null ? message : "Internal server error"
        ));
    }
}

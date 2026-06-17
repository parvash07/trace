package com.errorexplainer.service;

import com.errorexplainer.dto.AnalyzeResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class GroqService {

    private final RestClient restClient;

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.model:llama-3.3-70b-versatile}")
    private String model;

    public GroqService(RestClient.Builder builder) {
        this.restClient = builder.baseUrl("https://api.groq.com").build();
    }

    public AnalyzeResponse analyze(String stackTrace, String codeContext, String language) {
        String systemPrompt = """
            You are an expert error analysis engine.
            Respond ONLY with a valid JSON object. No preamble, no markdown, no explanation outside the JSON.
            The JSON must match this exact schema:
            {
              "errorType": "string — the exception class name or error category",
              "rootCause": "string — plain English explanation of why this error occurred",
              "fix": "string — exact steps or code changes to fix this specific error",
              "prevention": "string — best practices to prevent this class of error in future",
              "severity": "one of: LOW, MEDIUM, HIGH, CRITICAL"
            }
            """;

        String userPrompt = String.format("""
            Language: %s

            Stack trace:
            %s

            Code context:
            %s

            Analyze this error and respond with the JSON schema only.
            """, language, stackTrace, codeContext != null ? codeContext : "Not provided");

        Map<String, Object> requestBody = Map.of(
            "model", model,
            "messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user",   "content", userPrompt)
            ),
            "temperature", 0.1,
            "max_tokens", 2000,
            "response_format", Map.of("type", "json_object")
        );

        Map response = restClient.post()
            .uri("/openai/v1/chat/completions")
            .header("Authorization", "Bearer " + apiKey)
            .contentType(MediaType.APPLICATION_JSON)
            .body(requestBody)
            .retrieve()
            .body(Map.class);

        String raw = (String) ((Map)((Map)((List) response.get("choices")).get(0))
            .get("message")).get("content");

        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(raw.trim(), AnalyzeResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Groq JSON response: " + raw, e);
        }
    }
}

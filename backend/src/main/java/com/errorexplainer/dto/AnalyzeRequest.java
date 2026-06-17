package com.errorexplainer.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public class AnalyzeRequest {

    @NotBlank
    private String stackTrace;

    private String codeContext;

    @NotBlank
    private String language;

    private List<String> tags;

    public String getStackTrace() { return stackTrace; }
    public void setStackTrace(String stackTrace) { this.stackTrace = stackTrace; }

    public String getCodeContext() { return codeContext; }
    public void setCodeContext(String codeContext) { this.codeContext = codeContext; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
}

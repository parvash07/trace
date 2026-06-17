package com.errorexplainer.dto;

import com.errorexplainer.entity.ErrorEntry;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public class ErrorDiaryEntry {

    private UUID id;
    private String errorType;
    private String stackTrace;
    private String codeContext;
    private String rootCause;
    private String fix;
    private String prevention;
    private String severity;
    private String language;
    private String[] tags;
    private OffsetDateTime createdAt;
    private List<SimilarError> similarErrors;

    public static ErrorDiaryEntry fromEntity(ErrorEntry e, List<ErrorEntry> similar) {
        ErrorDiaryEntry dto = new ErrorDiaryEntry();
        dto.setId(e.getId());
        dto.setErrorType(e.getErrorType());
        dto.setStackTrace(e.getStackTrace());
        dto.setCodeContext(e.getCodeContext());
        dto.setRootCause(e.getRootCause());
        dto.setFix(e.getFix());
        dto.setPrevention(e.getPrevention());
        dto.setSeverity(e.getSeverity());
        dto.setLanguage(e.getLanguage());
        dto.setTags(e.getTags());
        dto.setCreatedAt(e.getCreatedAt());
        dto.setSimilarErrors(similar.stream()
            .map(s -> new SimilarError(s.getId(), s.getErrorType(), s.getRootCause(), s.getCreatedAt()))
            .toList());
        return dto;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getErrorType() { return errorType; }
    public void setErrorType(String errorType) { this.errorType = errorType; }

    public String getStackTrace() { return stackTrace; }
    public void setStackTrace(String stackTrace) { this.stackTrace = stackTrace; }

    public String getCodeContext() { return codeContext; }
    public void setCodeContext(String codeContext) { this.codeContext = codeContext; }

    public String getRootCause() { return rootCause; }
    public void setRootCause(String rootCause) { this.rootCause = rootCause; }

    public String getFix() { return fix; }
    public void setFix(String fix) { this.fix = fix; }

    public String getPrevention() { return prevention; }
    public void setPrevention(String prevention) { this.prevention = prevention; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String[] getTags() { return tags; }
    public void setTags(String[] tags) { this.tags = tags; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public List<SimilarError> getSimilarErrors() { return similarErrors; }
    public void setSimilarErrors(List<SimilarError> similarErrors) { this.similarErrors = similarErrors; }

    public static class SimilarError {
        private UUID id;
        private String errorType;
        private String rootCause;
        private OffsetDateTime createdAt;

        public SimilarError() {}

        public SimilarError(UUID id, String errorType, String rootCause, OffsetDateTime createdAt) {
            this.id = id;
            this.errorType = errorType;
            this.rootCause = rootCause;
            this.createdAt = createdAt;
        }

        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }

        public String getErrorType() { return errorType; }
        public void setErrorType(String errorType) { this.errorType = errorType; }

        public String getRootCause() { return rootCause; }
        public void setRootCause(String rootCause) { this.rootCause = rootCause; }

        public OffsetDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    }
}

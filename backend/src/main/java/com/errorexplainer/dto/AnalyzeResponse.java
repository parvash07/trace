package com.errorexplainer.dto;

public class AnalyzeResponse {

    private String errorType;
    private String rootCause;
    private String fix;
    private String prevention;
    private String severity;

    public String getErrorType() { return errorType; }
    public void setErrorType(String errorType) { this.errorType = errorType; }

    public String getRootCause() { return rootCause; }
    public void setRootCause(String rootCause) { this.rootCause = rootCause; }

    public String getFix() { return fix; }
    public void setFix(String fix) { this.fix = fix; }

    public String getPrevention() { return prevention; }
    public void setPrevention(String prevention) { this.prevention = prevention; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
}

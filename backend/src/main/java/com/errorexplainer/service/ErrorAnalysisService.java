package com.errorexplainer.service;

import com.errorexplainer.dto.AnalyzeRequest;
import com.errorexplainer.dto.AnalyzeResponse;
import com.errorexplainer.dto.ErrorDiaryEntry;
import com.errorexplainer.entity.ErrorEntry;
import com.errorexplainer.repository.ErrorRepository;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class ErrorAnalysisService {

    private final GroqService groqService;
    private final ErrorRepository errorRepository;

    public ErrorAnalysisService(GroqService groqService, ErrorRepository errorRepository) {
        this.groqService = groqService;
        this.errorRepository = errorRepository;
    }

    public ErrorDiaryEntry analyze(AnalyzeRequest request) {
        AnalyzeResponse groqResult = groqService.analyze(
            request.getStackTrace(),
            request.getCodeContext(),
            request.getLanguage()
        );

        List<ErrorEntry> similar = errorRepository
            .findTop3ByErrorTypeAndLanguageOrderByCreatedAtDesc(
                groqResult.getErrorType(),
                request.getLanguage()
            );

        ErrorEntry entry = new ErrorEntry();
        entry.setErrorType(groqResult.getErrorType());
        entry.setStackTrace(request.getStackTrace());
        entry.setCodeContext(request.getCodeContext());
        entry.setRootCause(groqResult.getRootCause());
        entry.setFix(groqResult.getFix());
        entry.setPrevention(groqResult.getPrevention());
        entry.setSeverity(groqResult.getSeverity());
        entry.setLanguage(request.getLanguage());
        entry.setTags(request.getTags() != null
            ? request.getTags().toArray(new String[0])
            : new String[]{});
        entry.setCreatedAt(OffsetDateTime.now());
        ErrorEntry saved = errorRepository.save(entry);

        return ErrorDiaryEntry.fromEntity(saved, similar);
    }
}

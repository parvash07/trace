package com.errorexplainer.controller;

import com.errorexplainer.dto.AnalyzeRequest;
import com.errorexplainer.dto.ErrorDiaryEntry;
import com.errorexplainer.entity.ErrorEntry;
import com.errorexplainer.repository.ErrorRepository;
import com.errorexplainer.service.ErrorAnalysisService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/errors")
@CrossOrigin(origins = "${frontend.url}")
public class ErrorController {

    private final ErrorAnalysisService analysisService;
    private final ErrorRepository errorRepository;

    public ErrorController(ErrorAnalysisService analysisService, ErrorRepository errorRepository) {
        this.analysisService = analysisService;
        this.errorRepository = errorRepository;
    }

    @PostMapping("/analyze")
    public ResponseEntity<ErrorDiaryEntry> analyze(@RequestBody @Valid AnalyzeRequest request) {
        return ResponseEntity.ok(analysisService.analyze(request));
    }

    @GetMapping("/diary")
    public ResponseEntity<Page<ErrorDiaryEntry>> getDiary(
        @RequestParam(defaultValue = "0")    int page,
        @RequestParam(defaultValue = "20")   int size,
        @RequestParam(required = false)      String tag,
        @RequestParam(required = false)      String language,
        Pageable pageable
    ) {
        Page<ErrorEntry> results;
        if (tag != null && language != null) {
            results = errorRepository.findByLanguageAndTagsContaining(language, tag, pageable);
        } else {
            results = errorRepository.findAll(pageable);
        }
        return ResponseEntity.ok(results.map(e -> ErrorDiaryEntry.fromEntity(e, List.of())));
    }

    @GetMapping("/diary/{id}")
    public ResponseEntity<ErrorDiaryEntry> getById(@PathVariable UUID id) {
        return errorRepository.findById(id)
            .map(e -> ResponseEntity.ok(ErrorDiaryEntry.fromEntity(e, List.of())))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> search(
        @RequestParam String q,
        @RequestParam(required = false) String language
    ) {
        List<ErrorEntry> results = errorRepository.fullTextSearch(q, language);
        return ResponseEntity.ok(Map.of(
            "results", results.stream().map(e -> ErrorDiaryEntry.fromEntity(e, List.of())).toList(),
            "query", q,
            "totalResults", results.size()
        ));
    }

    @DeleteMapping("/diary/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        errorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

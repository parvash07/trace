package com.errorexplainer.repository;

import com.errorexplainer.entity.ErrorEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ErrorRepository extends JpaRepository<ErrorEntry, UUID> {

    Page<ErrorEntry> findByLanguageAndTagsContaining(
        String language, String tag, Pageable pageable
    );

    List<ErrorEntry> findTop3ByErrorTypeAndLanguageOrderByCreatedAtDesc(
        String errorType, String language
    );

    @Query(value = """
        SELECT * FROM errors
        WHERE search_vector @@ plainto_tsquery('english', :query)
        AND (:language IS NULL OR language = :language)
        ORDER BY created_at DESC
        LIMIT 20
        """, nativeQuery = true)
    List<ErrorEntry> fullTextSearch(
        @Param("query") String query,
        @Param("language") String language
    );
}

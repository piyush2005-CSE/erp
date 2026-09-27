package com.erp.audit.service;

import com.erp.audit.entity.AuditLog;
import com.erp.audit.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Async
    public void log(Long userId, String action, String entityType, String entityId, String requestUri, String method) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .userId(userId)
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .requestUri(requestUri)
                    .requestMethod(method)
                    .status("SUCCESS")
                    .build();
            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            log.error("Failed to persist audit log: {}", e.getMessage());
        }
    }

    @Async
    public void logFailure(Long userId, String action, String errorMessage) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .userId(userId)
                    .action(action)
                    .status("FAILURE")
                    .errorMessage(errorMessage)
                    .build();
            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            log.error("Failed to persist audit log: {}", e.getMessage());
        }
    }
}

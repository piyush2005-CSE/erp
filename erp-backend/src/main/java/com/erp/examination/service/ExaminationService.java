package com.erp.examination.service;

import com.erp.examination.dto.ExamDto;
import com.erp.examination.dto.ExamResultDto;
import com.erp.examination.entity.Exam;
import com.erp.examination.entity.ExamResult;
import com.erp.examination.repository.ExamRepository;
import com.erp.examination.repository.ExamResultRepository;
import com.erp.course.repository.CourseRepository;
import com.erp.course.repository.SemesterRepository;
import com.erp.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExaminationService {

    private final ExamRepository examRepository;
    private final ExamResultRepository resultRepository;
    private final CourseRepository courseRepository;
    private final SemesterRepository semesterRepository;
    private final StudentRepository studentRepository;

    @Transactional(readOnly = true)
    public Page<ExamDto> getExams(Long semesterId, Pageable pageable) {
        return examRepository.findBySemesterId(semesterId, pageable).map(this::mapExamToDto);
    }

    @Transactional(readOnly = true)
    public List<ExamResultDto> getResultsByStudentAndSemester(Long studentId, Long semesterId) {
        return resultRepository.findByStudentIdAndExamSemesterId(studentId, semesterId).stream()
                .map(this::mapResultToDto)
                .toList();
    }

    private ExamDto mapExamToDto(Exam e) {
        return ExamDto.builder()
                .id(e.getId())
                .name(e.getName())
                .courseId(e.getCourse().getId())
                .courseCode(e.getCourse().getCode())
                .courseTitle(e.getCourse().getTitle())
                .semesterId(e.getSemester().getId())
                .examDate(e.getExamDate())
                .maxMarks(e.getMaxMarks())
                .passingMarks(e.getPassingMarks())
                .examType(e.getExamType())
                .isPublished(e.getIsPublished())
                .build();
    }

    private ExamResultDto mapResultToDto(ExamResult r) {
        boolean passed = r.getMarksObtained() >= r.getExam().getPassingMarks();
        return ExamResultDto.builder()
                .id(r.getId())
                .examId(r.getExam().getId())
                .examName(r.getExam().getName())
                .studentId(r.getStudent().getId())
                .studentName(r.getStudent().getFirstName() + " " + r.getStudent().getLastName())
                .rollNumber(r.getStudent().getRollNumber())
                .marksObtained(r.getMarksObtained())
                .remarks(r.getRemarks())
                .hasPassed(passed)
                .build();
    }
}

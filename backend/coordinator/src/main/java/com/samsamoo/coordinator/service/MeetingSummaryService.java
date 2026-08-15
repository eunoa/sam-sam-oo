package com.samsamoo.coordinator.service;

import com.samsamoo.coordinator.dto.meeting.MeetingSummaryResponse;
import com.samsamoo.coordinator.entity.Meeting;
import com.samsamoo.coordinator.entity.MeetingSummary;
import com.samsamoo.coordinator.exception.CustomException;
import com.samsamoo.coordinator.exception.ErrorCode;
import com.samsamoo.coordinator.repository.MeetingRepository;
import com.samsamoo.coordinator.repository.MeetingSummaryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class MeetingSummaryService {

    private final MeetingSummaryRepository meetingSummaryRepository;
    private final MeetingRepository meetingRepository;
    private final OpenAiService openAiService;

    public MeetingSummaryService(
            MeetingSummaryRepository meetingSummaryRepository,
            MeetingRepository meetingRepository,
            OpenAiService openAiService) {

        this.meetingSummaryRepository = meetingSummaryRepository;
        this.meetingRepository = meetingRepository;
        this.openAiService = openAiService;
    }

    public MeetingSummaryResponse getSummary(Long meetingId) {

        meetingRepository.findById(meetingId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.MEETING_NOT_FOUND));

        MeetingSummary meetingSummary =
                meetingSummaryRepository.findByMeeting_MeetingId(meetingId)
                        .orElseThrow(() ->
                                new CustomException(ErrorCode.MEETING_SUMMARY_NOT_FOUND));

        return new MeetingSummaryResponse(
                meetingSummary.getSummaryId(),
                meetingSummary.getMeeting().getMeetingId(),
                meetingSummary.getSummary(),
                meetingSummary.getCreatedAt()
        );
    }

    @Transactional
    public MeetingSummaryResponse createSummary(Long meetingId) {

        if (meetingSummaryRepository.findByMeeting_MeetingId(meetingId).isPresent()) {
            throw new CustomException(ErrorCode.MEETING_SUMMARY_ALREADY_EXISTS);
        }

        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.MEETING_NOT_FOUND));

        String summaryText =
                openAiService.summarize(meeting.getManualContent());

        MeetingSummary meetingSummary =
                new MeetingSummary(meeting, summaryText);

        MeetingSummary saved =
                meetingSummaryRepository.save(meetingSummary);

        return new MeetingSummaryResponse(
                saved.getSummaryId(),
                saved.getMeeting().getMeetingId(),
                saved.getSummary(),
                saved.getCreatedAt()
        );
    }
}
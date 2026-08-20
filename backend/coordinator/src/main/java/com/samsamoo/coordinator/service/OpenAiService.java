package com.samsamoo.coordinator.service;

import com.samsamoo.coordinator.dto.meeting.MeetingTimeRecommendationResponse;
import com.samsamoo.coordinator.exception.CustomException;
import com.samsamoo.coordinator.exception.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class OpenAiService {

    private final String apiKey;
    private final String model;
    private final RestClient restClient;

    public OpenAiService(
            @Value("${openai.api.key}") String apiKey,
            @Value("${openai.model}") String model) {

        this.apiKey = apiKey;
        this.model = model;

        this.restClient = RestClient.builder()
                .baseUrl("https://api.openai.com")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();
    }

    // 회의 내용을 AI로 요약
    public String summarize(String manualContent) {

        String prompt =
                "다음 회의 내용을 핵심 내용 중심으로 간결하게 한국어로 요약해줘.\n\n"
                        + manualContent;

        Map<String, Object> requestBody = Map.of(
                "model", model,
                "input", prompt
        );

        JsonNode response = restClient.post()
                .uri("/v1/responses")
                .body(requestBody)
                .retrieve()
                .body(JsonNode.class);

        for (JsonNode output : response.path("output")) {

            if ("message".equals(output.path("type").asText())) {

                for (JsonNode content : output.path("content")) {

                    if ("output_text".equals(content.path("type").asText())) {
                        return content.path("text").asText();
                    }
                }
            }
        }

        throw new RuntimeException(
                "OpenAI 응답에서 요약 내용을 찾을 수 없습니다."
        );
    }

    // 회의 내용을 분석하여 AI 업무 제안 생성
    public List<String> suggestTasks(String manualContent) {

        String prompt =
                "다음 회의 내용을 분석해서 실제로 수행해야 할 업무를 제안해줘.\n" +
                        "업무는 최대 5개까지만 작성하고, 각 업무는 한 줄에 하나씩 작성해줘.\n" +
                        "번호, 불릿(-), 설명은 붙이지 말고 업무 내용만 작성해줘.\n\n" +
                        manualContent;

        Map<String, Object> requestBody = Map.of(
                "model", model,
                "input", prompt
        );

        JsonNode response = restClient.post()
                .uri("/v1/responses")
                .body(requestBody)
                .retrieve()
                .body(JsonNode.class);

        String resultText = null;

        for (JsonNode output : response.path("output")) {

            if ("message".equals(output.path("type").asText())) {

                for (JsonNode content : output.path("content")) {

                    if ("output_text".equals(content.path("type").asText())) {
                        resultText = content.path("text").asText();
                        break;
                    }
                }
            }
        }

        if (resultText == null || resultText.isBlank()) {
            throw new RuntimeException(
                    "OpenAI 응답에서 업무 제안 내용을 찾을 수 없습니다."
            );
        }

        List<String> suggestions = new ArrayList<>();

        for (String line : resultText.split("\\R")) {

            String task = line.trim();

            if (!task.isBlank()) {
                suggestions.add(task);
            }
        }

        return suggestions;
    }

    // 전달받은 내용을 지정한 언어로 번역
    public String translate(String text, String targetLanguage) {

        // 서비스에서 지원하는 언어인지 확인
        if (!isSupportedLanguage(targetLanguage)) {
            throw new CustomException(ErrorCode.UNSUPPORTED_LANGUAGE);
        }

        String prompt =
                "다음 내용을 " + targetLanguage + " 언어로 자연스럽고 정확하게 번역해줘.\n" +
                        "원문의 의미와 구조를 최대한 유지하고, 번역 결과만 출력해줘.\n\n" +
                        text;

        Map<String, Object> requestBody = Map.of(
                "model", model,
                "input", prompt
        );

        JsonNode response = restClient.post()
                .uri("/v1/responses")
                .body(requestBody)
                .retrieve()
                .body(JsonNode.class);

        String translatedText = null;

        for (JsonNode output : response.path("output")) {

            if ("message".equals(output.path("type").asText())) {

                for (JsonNode content : output.path("content")) {

                    if ("output_text".equals(content.path("type").asText())) {
                        translatedText = content.path("text").asText();
                        break;
                    }
                }
            }
        }

        if (translatedText == null || translatedText.isBlank()) {
            throw new RuntimeException(
                    "OpenAI 응답에서 번역 결과를 찾을 수 없습니다."
            );
        }

        return translatedText;
    }

    // 서비스에서 지원하는 언어인지 확인
    private boolean isSupportedLanguage(String targetLanguage) {

        return List.of(
                "ko",
                "en",
                "ja",
                "fr"
        ).contains(targetLanguage);
    }

    // 프로젝트 멤버들의 가능 시간과 시간대를 바탕으로 회의시간 추천
    public MeetingTimeRecommendationResponse recommendMeetingTime(
            LocalDate date,
            LocalTime startTime,
            LocalTime endTime,
            String requestTimezone,
            String availabilityInfo) {

        String prompt =
                "다음 프로젝트 멤버들의 가능 시간과 시간대를 분석해서 " +
                        "가장 많은 멤버가 동시에 참여할 수 있는 회의 시간을 하나 추천해줘.\n\n" +

                        "사용자가 선택한 회의 날짜: " + date + "\n" +
                        "사용자가 원하는 시간 범위: "
                        + startTime + " ~ " + endTime + "\n" +
                        "사용자가 입력한 날짜와 시간의 기준 timezone: "
                        + requestTimezone + "\n\n" +

                        "멤버별 가능 시간과 시간대:\n" +
                        availabilityInfo + "\n" +

                        "사용자가 요청한 날짜, startTime, endTime은 반드시 " +
                        "위의 기준 timezone 기준 현지 시간으로 해석해줘.\n" +

                        "각 프로젝트 멤버의 가능 시간은 " +
                        "각 멤버에게 표시된 timezone 기준 현지 시간이야.\n" +

                        "각 멤버의 timezone을 고려하여 모든 시간을 " +
                        "동일한 실제 시각 기준으로 변환한 뒤 비교해줘.\n" +

                        "단순히 서로 다른 timezone의 시계상 시간이 같다는 이유로 " +
                        "동시에 참여 가능하다고 판단하면 안 돼.\n" +

                        "추천 결과의 TIME은 요청자의 기준 timezone인 " +
                        requestTimezone + " 기준으로 출력해줘.\n" +

                        "추천 시간은 사용자가 요청한 startTime과 endTime 범위를 " +
                        "절대 벗어나면 안 돼.\n" +

                        "모든 프로젝트 멤버가 동시에 참여 가능한 시간이 있다면 " +
                        "그 시간을 가장 우선적으로 추천해줘.\n" +

                        "모든 멤버가 동시에 참여 가능한 시간이 없다면 " +
                        "참여 가능한 멤버 수가 가장 많은 시간대를 추천해줘.\n" +

                        "여러 시간대에서 참여 가능한 인원 수가 동일하다면 " +
                        "사용자가 요청한 시간 범위 안에서 더 이른 시간을 우선 추천해줘.\n" +

                        "추천 이유에는 전체 프로젝트 멤버 수와 " +
                        "추천 시간에 참여 가능한 멤버 수를 반드시 포함해줘.\n" +

                        "추천 이유에서 각 멤버의 timezone을 고려하여 " +
                        "실제 동일 시각 기준으로 비교한 결과를 설명해줘.\n" +

                        "요청한 시간 범위 안에서 참여 가능한 멤버가 한 명도 없다면 " +
                        "TIME에는 NONE을 출력하고 그 이유를 설명해줘.\n" +

                        "TIME이 NONE인 경우에도 DATE에는 " +
                        "사용자가 요청한 날짜를 그대로 출력해줘.\n" +

                        "반드시 아래 형식으로만 답변하고 다른 문장이나 설명은 추가하지 마.\n" +
                        "DATE: YYYY-MM-DD\n" +
                        "TIME: HH:mm~HH:mm 또는 NONE\n" +
                        "REASON: 추천 이유";

        Map<String, Object> requestBody = Map.of(
                "model", model,
                "input", prompt
        );

        JsonNode response = restClient.post()
                .uri("/v1/responses")
                .body(requestBody)
                .retrieve()
                .body(JsonNode.class);

        String resultText = null;

        for (JsonNode output : response.path("output")) {

            if ("message".equals(output.path("type").asText())) {

                for (JsonNode content : output.path("content")) {

                    if ("output_text".equals(content.path("type").asText())) {
                        resultText = content.path("text").asText();
                        break;
                    }
                }
            }
        }

        if (resultText == null || resultText.isBlank()) {
            throw new RuntimeException(
                    "OpenAI 응답에서 회의시간 추천 결과를 찾을 수 없습니다."
            );
        }

        String recommendedDate = null;
        String recommendedTime = null;
        String reason = null;

        for (String line : resultText.split("\\R")) {

            String trimmedLine = line.trim();

            if (trimmedLine.startsWith("DATE:")) {
                recommendedDate =
                        trimmedLine.substring("DATE:".length()).trim();
            }

            if (trimmedLine.startsWith("TIME:")) {
                recommendedTime =
                        trimmedLine.substring("TIME:".length()).trim();
            }

            if (trimmedLine.startsWith("REASON:")) {
                reason =
                        trimmedLine.substring("REASON:".length()).trim();
            }
        }

        if (recommendedDate == null
                || recommendedTime == null
                || reason == null) {

            throw new RuntimeException(
                    "OpenAI 회의시간 추천 응답 형식이 올바르지 않습니다."
            );
        }

        return new MeetingTimeRecommendationResponse(
                recommendedDate,
                recommendedTime,
                reason
        );
    }
}
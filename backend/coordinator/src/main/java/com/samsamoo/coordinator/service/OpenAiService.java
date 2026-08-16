package com.samsamoo.coordinator.service;

import com.samsamoo.coordinator.exception.CustomException;
import com.samsamoo.coordinator.exception.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;

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
}
package com.samsamoo.coordinator.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;

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

        throw new RuntimeException("OpenAI 응답에서 요약 내용을 찾을 수 없습니다.");
    }
}
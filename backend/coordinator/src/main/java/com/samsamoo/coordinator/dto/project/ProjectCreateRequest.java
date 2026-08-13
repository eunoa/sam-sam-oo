package com.samsamoo.coordinator.dto.project;

public class ProjectCreateRequest {

    private String name;
    private String description;

    protected ProjectCreateRequest() {
    }

    public ProjectCreateRequest(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }
}

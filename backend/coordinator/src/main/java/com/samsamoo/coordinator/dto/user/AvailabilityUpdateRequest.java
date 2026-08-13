package com.samsamoo.coordinator.dto.user;

import java.util.List;

public class AvailabilityUpdateRequest {

    private List<AvailabilityItem> availabilities;

    protected AvailabilityUpdateRequest() {
    }

    public AvailabilityUpdateRequest(List<AvailabilityItem> availabilities) {
        this.availabilities = availabilities;
    }

    public List<AvailabilityItem> getAvailabilities() {
        return availabilities;
    }
}

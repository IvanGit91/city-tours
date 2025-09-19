package ivan.personal.tours.model.geo;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class Geometry implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private String type;

    @Column(columnDefinition = "TEXT")
    private String coordinates;

    public List<List<List<List<Double>>>> getCoordinates() {
        List<List<List<List<Double>>>> geojsons = new ArrayList<>();
        if (this.coordinates != null && !this.coordinates.isEmpty()) {
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                geojsons = objectMapper.readValue(this.coordinates, new TypeReference<>() {
                });
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }
        return geojsons;
    }
}

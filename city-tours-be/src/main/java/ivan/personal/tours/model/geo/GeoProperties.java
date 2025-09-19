package ivan.personal.tours.model.geo;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GeoProperties implements Serializable {
    @Serial
    private static final long serialVersionUID = -1L;

    private Long cityId;
    private Boolean showOnMap;
    private String additionalPopupContent;
    private String color;
}

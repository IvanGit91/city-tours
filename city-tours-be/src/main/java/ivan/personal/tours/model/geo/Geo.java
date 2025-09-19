package ivan.personal.tours.model.geo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ivan.personal.tours.model.District;
import ivan.personal.tours.model.base.BaseAuditableEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.io.Serial;
import java.io.Serializable;

@Entity
@Table(name = "geos")
@Data
@NoArgsConstructor
@ToString
@EqualsAndHashCode(callSuper = true)
public class Geo extends BaseAuditableEntity<Long> implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Embedded
    private GeoProperties properties;

    @Embedded
    private Geometry geometry;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_geos_TO_districts"))
    @JsonIgnore
    private District district;
}

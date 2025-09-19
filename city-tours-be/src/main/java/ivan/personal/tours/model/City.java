package ivan.personal.tours.model;

import ivan.personal.tours.model.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.io.Serial;
import java.io.Serializable;

@Entity
@Table(name = "cities")
@Data
@NoArgsConstructor
@ToString
@EqualsAndHashCode(callSuper = true)
public class City extends BaseEntity<Long> implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @NotNull
    @Column
    private String name;

    private Double lat;

    private Double lng;

    private String country;

    @Column(length = 2)
    private String countryCode;

}

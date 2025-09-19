package ivan.personal.tours.model;

import ivan.personal.tours.model.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

@Entity
@Data
@Table(name = "roles")
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Role extends BaseEntity<Long> implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @NotEmpty
    @Column
    private String name;
}


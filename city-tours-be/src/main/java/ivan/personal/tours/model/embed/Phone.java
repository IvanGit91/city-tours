package ivan.personal.tours.model.embed;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class Phone implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Column(length = 5)
    @Size(max = 5)
    private String area;

    @Column(length = 5)
    @Size(max = 5)
    private String exchange;

    @Column(length = 5)
    @Size(max = 5)
    private String subscriber;
}

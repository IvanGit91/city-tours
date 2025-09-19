package ivan.personal.tours.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import ivan.personal.tours.enums.POI_TYPE;
import ivan.personal.tours.model.base.BaseAuditableEntity;
import ivan.personal.tours.model.embed.Phone;
import ivan.personal.tours.model.geo.Geo;
import ivan.personal.tours.utility.LocalDateDeserializer;
import ivan.personal.tours.utility.utils.TypizedFile;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Table(name = "pois")
@Data
@NoArgsConstructor
@ToString
@EqualsAndHashCode(callSuper = true)
public class Poi extends BaseAuditableEntity<Long> implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @NotNull
    @Column
    private String denomination;

    @Embedded
    private Phone phone;

    @Column
    private String address;

    @Column
    private String webSite;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String descriptionEng;

    @Column
    private String time;

    @Column
    private String email;

    @Column
    private String imagePath;

    @Column
    @Enumerated(EnumType.STRING)
    private POI_TYPE type;

    @Column
    @JsonDeserialize(using = LocalDateDeserializer.class)
    @JsonSerialize(using = LocalDateSerializer.class)
    private LocalDate approvalDate;

    @Transient
    private transient TypizedFile image;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_pois_TO_geos"))
    @JsonIgnoreProperties({"hibernateLazyInitializer"})
    private Geo geo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_pois_TO_districts"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "pois", "approvalDate"})
    private District district;

    //@NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_pois_TO_users"))
    @JsonIgnoreProperties({"hibernateLazyInitializer"})
    private User redactor;

    @Transient
    private boolean light = false;

    public Poi(Long id, String denomination, POI_TYPE type, Geo geo) {
        this.id = id;
        this.denomination = denomination;
        this.type = type;
        this.geo = geo;
        this.light = true;
    }

    public Poi(Poi p, Boolean light) {
        this.id = p.getId();
        this.denomination = p.getDenomination();
        this.geo = p.getGeo();
        this.light = light;
    }
}

package ivan.personal.tours.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import ivan.personal.tours.model.base.BaseAuditableEntity;
import ivan.personal.tours.model.embed.Phone;
import ivan.personal.tours.model.geo.Geo;
import ivan.personal.tours.utility.LocalDateDeserializer;
import ivan.personal.tours.utility.utils.TypizedFile;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "districts")
@Data
@NoArgsConstructor
@ToString(exclude = {"geos", "pois"})
@EqualsAndHashCode(callSuper = true, exclude = {"geos", "pois"})
public class District extends BaseAuditableEntity<Long> implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @NotNull
    @Column
    private String denomination;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String descriptionEng;

    @Embedded
    private Phone phone;

    @Column
    private String address;

    @Column
    private String webSite;

    @Column
    private String email;

    @Column
    private String imagePath;

    @Column
    private String logoPath;

    @Column(length = 10)
    @Size(max = 10)
    private String color;

    @Column
    @JsonDeserialize(using = LocalDateDeserializer.class)
    @JsonSerialize(using = LocalDateSerializer.class)
    private LocalDate approvalDate;

    @Transient
    private transient TypizedFile image;

    @Transient
    private transient TypizedFile logo;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "district")
    private List<Geo> geos;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "district")
    @JsonIgnoreProperties("district")
    @JsonIgnore
    private List<Poi> pois;

    //@NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_districts_TO_users"))
    @JsonIgnoreProperties({"hibernateLazyInitializer"})
    private User redactor;

}

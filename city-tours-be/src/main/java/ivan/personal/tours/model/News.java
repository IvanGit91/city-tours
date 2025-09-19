package ivan.personal.tours.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import ivan.personal.tours.model.base.BaseAuditableEntity;
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

@Entity
@Table(name = "news")
@Data
@NoArgsConstructor
@ToString
@EqualsAndHashCode(callSuper = true)
public class News extends BaseAuditableEntity<Long> implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @NotNull
    @Column(name = "title")
    private String title;

    @NotNull
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "description_extended", columnDefinition = "TEXT")
    private String descriptionExtended;

    @Column(name = "description_eng", columnDefinition = "TEXT")
    private String descriptionEng;

    @NotNull
    @Column(name = "publication_date")
    @JsonDeserialize(using = LocalDateDeserializer.class)
    @JsonSerialize(using = LocalDateSerializer.class)
    private LocalDate publicationDate;

    //@NotNull
    @Column(name = "approval_date")
    @JsonDeserialize(using = LocalDateDeserializer.class)
    @JsonSerialize(using = LocalDateSerializer.class)
    private LocalDate approvalDate;

    @Column(name = "path_image")
    private String pathImage;

    @Transient
    private transient TypizedFile image;

    @Column(name = "author", length = 99)
    @Size(max = 99)
    private String author;

    //@NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_news_TO_users"))
    @JsonIgnoreProperties({"hibernateLazyInitializer"})
    private User redactor;
}

package ivan.personal.tours.model.base;

import ivan.personal.tours.enums.FV;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serializable;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseAuditableEntity<ID extends Serializable> extends BaseEntity<ID> {

    @Column(name = "created_date", nullable = false, updatable = false, columnDefinition = "bigint default 0")
    @CreatedDate
    private Long createdDate;

    @Column(name = "modified_date")
    @LastModifiedDate
    private Long modifiedDate;

    @Column(name = "created_by", updatable = false)
    @CreatedBy
    private String createdBy;

    @Column(name = "modified_by")
    @LastModifiedBy
    private String modifiedBy;

    @Column(name = "fv", columnDefinition = "CHAR(1)")
    @Enumerated(EnumType.STRING)
    private FV fv;

    @PrePersist
    public void onPrePersist() {
        this.fv = FV.S;
    }

    @PreUpdate
    public void onPreUpdate() {
        this.fv = FV.S;
    }

    @PreRemove
    public void onPreRemove() {
    }
}

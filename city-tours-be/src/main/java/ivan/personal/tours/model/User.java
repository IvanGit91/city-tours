package ivan.personal.tours.model;

import ivan.personal.tours.annotation.UniqueId;
import ivan.personal.tours.model.base.BaseAuditableEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

@Entity
@Data
@Table(name = "users")
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class User extends BaseAuditableEntity<Long> implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @UniqueId
    @NotEmpty
    private String email;

    @NotEmpty
    @Size(min = 3, message = "Length must be more than 3")
    private String password;

    @NotEmpty
    private String name;

    @NotEmpty
    private String phone;

    @NotEmpty
    private String address;

    @NotNull
    private Boolean active;

    @NotNull
    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "FK_users_TO_roles"))
    private Role role;

    @NotNull
    private Boolean verify;

}


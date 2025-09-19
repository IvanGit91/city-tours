package ivan.personal.tours.repository;


import ivan.personal.tours.enums.FV;
import ivan.personal.tours.model.Role;
import ivan.personal.tours.model.User;

import java.util.Collection;
import java.util.Optional;

public interface UserRepository extends BaseAuditableRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByEmailAndFv(String email, FV fv);

    Collection<User> findAllByRole(Role role);

    boolean existsByEmailAndFv(String email, FV fv);
}

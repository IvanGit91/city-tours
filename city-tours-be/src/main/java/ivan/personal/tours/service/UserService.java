package ivan.personal.tours.service;

import ivan.personal.tours.enums.FV;
import ivan.personal.tours.exception.AppException;
import ivan.personal.tours.model.Role;
import ivan.personal.tours.model.User;
import ivan.personal.tours.repository.BaseAuditableRepository;
import ivan.personal.tours.repository.BaseRepository;
import ivan.personal.tours.repository.UserRepository;
import org.springframework.context.annotation.DependsOn;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Optional;


@Service
@DependsOn("passwordEncoder")
public class UserService extends BaseAuditableService<User, Long> {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public UserService(BaseRepository<User, Long> baseRepository,
                       BaseAuditableRepository<User, Long> baseAuditableRepository,
                       PasswordEncoder passwordEncoder, UserRepository userRepository) {
        super(baseRepository, baseAuditableRepository, User.class);
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findByEmailAndFv(String email) {
        return userRepository.findByEmailAndFv(email, FV.S);
    }

    public Collection<User> findByRole(Role role) {
        return userRepository.findAllByRole(role);
    }

    public boolean existsByEmailAndFv(String email) {
        return userRepository.existsByEmailAndFv(email, FV.S);
    }

    @Override
    @Transactional
    public User save(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        try {
            return userRepository.save(user);
        } catch (Exception e) {
            throw new AppException(HttpStatus.BAD_REQUEST, "error");
        }
    }
}

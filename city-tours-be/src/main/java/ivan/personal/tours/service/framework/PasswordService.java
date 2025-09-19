package ivan.personal.tours.service.framework;

import ivan.personal.tours.environment.port.IPasswordGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PasswordService {
    // Inject it based on the active profile
    private final IPasswordGenerator passwordGenerator;

    public String generatePassword() {
        return passwordGenerator.generatePassword();
    }
}

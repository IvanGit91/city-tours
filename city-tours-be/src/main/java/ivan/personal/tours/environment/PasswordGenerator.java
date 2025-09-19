package ivan.personal.tours.environment;

import ivan.personal.tours.environment.port.IPasswordGenerator;
import ivan.personal.tours.utility.utils.URandom;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("!dev")
public class PasswordGenerator implements IPasswordGenerator {
    @Override
    public String generatePassword() {
        return URandom.generateStrongPassword();
    }
}

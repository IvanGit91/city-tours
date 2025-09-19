package ivan.personal.tours.environment.local;

import ivan.personal.tours.environment.port.IPasswordGenerator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
public class PasswordGenerator implements IPasswordGenerator {
    @Value("${app.dev.psw}")
    private String defaultPassword;

    @Override
    public String generatePassword() {
        return defaultPassword;
    }
}

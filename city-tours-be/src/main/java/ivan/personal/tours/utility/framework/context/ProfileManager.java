package ivan.personal.tours.utility.framework.context;

import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class ProfileManager {
    private final Environment env;

    public ProfileManager(Environment env) {
        this.env = env;
    }

    public boolean isDev() {
        return Arrays.stream(env.getActiveProfiles())
                .anyMatch("dev"::equalsIgnoreCase);
    }
}

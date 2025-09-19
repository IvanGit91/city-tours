package ivan.personal.tours.utility.framework;

import ivan.personal.tours.enums.ROLE_ENUM;
import lombok.extern.java.Log;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;


@Log
@Component
public class AuthContext {
    public static String authName() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return !(authentication instanceof AnonymousAuthenticationToken) ? authentication.getName() : null;
    }

    public static Boolean isAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return !(authentication instanceof AnonymousAuthenticationToken) &&
                authentication.getAuthorities().stream().anyMatch(s -> s.getAuthority().equals(ROLE_ENUM.ROLE_ADMINISTRATOR.name()));
    }

    public static Boolean isRedactor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return !(authentication instanceof AnonymousAuthenticationToken) &&
                authentication.getAuthorities().stream().anyMatch(s -> s.getAuthority().equals(ROLE_ENUM.ROLE_REDACTOR.name()));
    }

}

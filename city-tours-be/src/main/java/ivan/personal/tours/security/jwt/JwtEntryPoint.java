package ivan.personal.tours.security.jwt;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.java.Log;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
@Log
public class JwtEntryPoint implements AuthenticationEntryPoint {
    // called if authentication failed
    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException e) {

        log.severe(String.format("Unauthorized error. Message - %s", e.getMessage()));
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
    }
}
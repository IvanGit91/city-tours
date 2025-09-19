package ivan.personal.tours.security.jwt;

import ivan.personal.tours.exception.AppException;
import ivan.personal.tours.model.User;
import ivan.personal.tours.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtProvider jwtProvider;
    private final UserService userService;

    private static UsernamePasswordAuthenticationToken getUsernamePasswordAuthenticationToken(Optional<User> userOpt) {
        if (userOpt.isEmpty()) {
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found");
        }
        User user = userOpt.get();
        // pwd not necessary
        // if jwt ok, then authenticate
        SimpleGrantedAuthority sga = new SimpleGrantedAuthority(user.getRole().getName());
        ArrayList<SimpleGrantedAuthority> list = new ArrayList<>();
        list.add(sga);
        return new UsernamePasswordAuthenticationToken(user.getEmail(), null, list);
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest httpServletRequest,
                                    @NonNull HttpServletResponse httpServletResponse,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        String jwt = getToken(httpServletRequest);
        if (jwt != null && jwtProvider.validate(jwt)) {
            try {
                String userAccount = jwtProvider.getUserAccount(jwt);
                Optional<User> userOpt = userService.findByEmailAndFv(userAccount);
                UsernamePasswordAuthenticationToken auth = getUsernamePasswordAuthenticationToken(userOpt);
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (Exception e) {
                logger.error("Set Authentication from JWT failed");
            }
        }
        filterChain.doFilter(httpServletRequest, httpServletResponse);
    }

    private String getToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.replace("Bearer ", "");
        }

        return null;
    }
}

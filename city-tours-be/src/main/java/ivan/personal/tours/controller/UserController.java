package ivan.personal.tours.controller;

import ivan.personal.tours.dto.Psw;
import ivan.personal.tours.exception.AppException;
import ivan.personal.tours.model.User;
import ivan.personal.tours.payload.request.LoginForm;
import ivan.personal.tours.payload.response.JwtResponse;
import ivan.personal.tours.security.jwt.JwtProvider;
import ivan.personal.tours.service.UserService;
import ivan.personal.tours.service.framework.MailService;
import ivan.personal.tours.service.framework.PasswordService;
import ivan.personal.tours.utility.framework.AuthContext;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtProvider jwtProvider;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final PasswordService passwordService;

    @Value("${app.host}")
    private String appHost;

    @PostMapping("/login")
    public JwtResponse login(@RequestBody LoginForm loginForm) {
        // throws Exception if authentication failed
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginForm.getUsername(), loginForm.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtProvider.generate(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Optional<User> userOpt = userService.findByEmailAndFv(userDetails.getUsername());
            if (userOpt.isEmpty()) {
                throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found");
            }
            User user = userOpt.get();
            return new JwtResponse(user.getId(), jwt, user.getEmail(), user.getName(), user.getRole().getName(), user.getVerify());
        } catch (AuthenticationException e) {
            e.printStackTrace();
            throw new AppException(HttpStatus.UNAUTHORIZED, "not.authorized");
        }
    }

    @PostMapping("/auth/register")
    public User save(@RequestBody User user) {
        String email = user.getEmail();
        Optional<User> userOpt = userService.findByEmailAndFv(email);
        if (userOpt.isEmpty()) {
            String generatedPassword = passwordService.generatePassword();
            user.setPassword(generatedPassword);

            userService.save(user);
            mailService.sendSimpleMail(user.getEmail(), "Activate your personal account",
                    """
                            Welcome %s, your account has been created.
                            Username: %s
                            Password: %s
                            
                            Please visit %s to login to your account.
                            """.formatted(user.getName(), user.getEmail(), generatedPassword, appHost));
        } else {
            throw new AppException(HttpStatus.BAD_REQUEST, "entity.already.exists", getClass().getName(), email);
        }
        return user;
    }

    @PutMapping("/auth/updateUser")
    public ResponseEntity<User> updateUser(@RequestBody User user) {
        Optional<User> userOpt = userService.findByIdAndFv(user.getId());
        if (userOpt.isEmpty()) {
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found");
        }
        if (Boolean.TRUE.equals(userOpt.get().getVerify())) {
            user.setVerify(true);
            userService.getBaseAuditableRepository().saveAndFlush(user);
        } else {
            user.setVerify(false);
            userService.getBaseAuditableRepository().saveAndFlush(user);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Transactional
    @DeleteMapping(value = "/auth/logical/{id}")
    public Boolean logicalDeleteUser(@PathVariable("id") Long id) {
        Optional<User> userOpt = userService.findByIdAndFv(id);
        if (userOpt.isEmpty()) {
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found", "user", id.toString());
        }
        userService.logicalDeleteMulti(userOpt.get(), List.of());
        return true;
    }

    @GetMapping("/auth/allProfile")
    public List<User> allProfile() {
        return userService.findAllByFv();
    }

    @GetMapping("/auth/oneProfile/{id}")
    public User oneProfile(@PathVariable("id") Long id) {
        Optional<User> user = userService.findByIdAndFv(id);
        if (user.isEmpty()) {
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found");
        }
        return user.get();
    }

    @PostMapping("/auth/resetProfile/{email}")
    public User profileByEmail(@PathVariable("email") String email) {
        Optional<User> userOpt = userService.findByEmailAndFv(email);
        if (userOpt.isEmpty()) {
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found");
        } else {
            User user = userOpt.get();
            String generatedPassword = passwordService.generatePassword();

            user.setPassword(generatedPassword);
            userService.save(user);
            mailService.sendSimpleMail(user.getEmail(), "Reset personal account",
                    """
                            Welcome %s, your password has been reset.
                            Username: %s
                            Password: %s
                            
                            Please visit %s to login to your account.
                            """.formatted(user.getName(), user.getEmail(), generatedPassword, appHost));
        }
        return userOpt.get();
    }

    @PostMapping(value = "/auth/activateProfile/{id}")
    public User activateProfile(@PathVariable("id") Long id, @RequestBody Psw bodyPsw) {
        Optional<User> user = userService.findByIdAndFv(id);
        if (user.isEmpty()) {
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found");
        }
        if (!passwordEncoder.matches(bodyPsw.getTempPassword(), user.get().getPassword())) {
            throw new AppException(HttpStatus.BAD_REQUEST, "not.authorized");
        }
        user.get().setPassword(passwordEncoder.encode(bodyPsw.getNewPassword()));
        user.get().setVerify(true);
        userService.getBaseAuditableRepository().saveAndFlush(user.get());
        return user.get();
    }

    @GetMapping("/auth/checkEmail/{email}")
    public boolean checkEmail(@PathVariable("email") String email) {
        return userService.existsByEmailAndFv(email);
    }

    @GetMapping("/auth/checkPsw")
    public boolean checkPsw(@RequestParam String psw) {
        User user = userService.findByUniqueIdAndFv(AuthContext.authName());
        return passwordEncoder.matches(psw, user.getPassword());
    }

}

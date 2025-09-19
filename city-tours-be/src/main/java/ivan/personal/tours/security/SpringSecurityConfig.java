package ivan.personal.tours.security;

import ivan.personal.tours.config.FilterChainExceptionHandler;
import ivan.personal.tours.security.jwt.JwtEntryPoint;
import ivan.personal.tours.security.jwt.JwtFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.sql.DataSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@DependsOn("passwordEncoder")
public class SpringSecurityConfig {

    private final JwtFilter jwtFilter;
    private final JwtEntryPoint accessDenyHandler;
    private final FilterChainExceptionHandler filterChainExceptionHandler;

    @Value("${spring.queries.users-query}")
    private String usersQuery;

    @Value("${spring.queries.roles-query}")
    private String rolesQuery;

    @Value("${cors.allowed-origins}")
    private String[] allowedOrigins;

    @Value("${cors.allowed-methods}")
    private String[] allowedMethods;

    @Value("${cors.allowed-headers}")
    private String[] allowedHeaders;

    public SpringSecurityConfig(JwtFilter jwtFilter,
                                JwtEntryPoint accessDenyHandler,
                                FilterChainExceptionHandler filterChainExceptionHandler) {
        this.jwtFilter = jwtFilter;
        this.accessDenyHandler = accessDenyHandler;
        this.filterChainExceptionHandler = filterChainExceptionHandler;
    }

    /**
     * Replaces AuthenticationManagerBuilder config
     */
    @Bean
    public UserDetailsManager userDetailsService(DataSource dataSource) {
        JdbcUserDetailsManager manager = new JdbcUserDetailsManager(dataSource);
        manager.setUsersByUsernameQuery(usersQuery);
        manager.setAuthoritiesByUsernameQuery(rolesQuery);
        return manager;
    }

    /* Global AuthenticationManager configured with an AuthenticationProvider bean.
     * UserDetailsService beans will not be used by Spring Security for automatically configuring username/password login.
     * Consider removing the AuthenticationProvider bean.
     * Alternatively, consider using the UserDetailsService in a manually instantiated DaoAuthenticationProvider.
     * If the current configuration is intentional, to turn off this warning,
     * increase the logging level of 'org.springframework.security.config.annotation.authentication.configuration.InitializeUserDetailsBeanManagerConfigurer' to ERROR
     */
//    @Bean
//    public AuthenticationProvider authenticationProvider(UserDetailsManager userDetailsManager) {
//        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
//        provider.setUserDetailsService(userDetailsManager);
//        provider.setPasswordEncoder(passwordEncoder);
//        return provider;
//    }

    /**
     * Expose AuthenticationManager (needed for login endpoints)
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .addFilterBefore(filterChainExceptionHandler, LogoutFilter.class)
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // allow preflight
                        .requestMatchers(
                                "/profile/**",
                                "/district/auth/**",
                                "/geo/auth/**",
                                "/news/auth/**",
                                "/poi/auth/**").authenticated()
                        .requestMatchers("/activatedProfile/**", "/allProfile/**", "/updateUser/**", "/deleteUser/**, /utility/auth/**")
                        .hasAnyAuthority("ROLE_ADMINISTRATOR")
                        .anyRequest().permitAll()
                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(accessDenyHandler)
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // TODO - put the right URL for production use
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins));
        configuration.setAllowedMethods(Arrays.asList(allowedMethods));
        configuration.setAllowedHeaders(Arrays.asList(allowedHeaders));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

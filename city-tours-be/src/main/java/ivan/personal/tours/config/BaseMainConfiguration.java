package ivan.personal.tours.config;

import ivan.personal.tours.utility.framework.context.ApplicationContextProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.orm.jpa.support.OpenEntityManagerInViewFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

import java.util.Properties;

@Configuration
@EnableTransactionManagement
@EnableJpaAuditing
public class BaseMainConfiguration extends WebMvcConfigurationSupport {

    private final ApplicationContext ctx;
    @Value("${spring.mail.host}")
    private String host;
    @Value("${spring.mail.port}")
    private int port;
    @Value("${spring.mail.username}")
    private String username;
    @Value("${spring.mail.password}")
    private String password;

    public BaseMainConfiguration(ApplicationContext ctx) {
        this.ctx = ctx;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public ApplicationContextProvider contextProvider() {
        return new ApplicationContextProvider(this.ctx);
    }

    // Solve the lazy loading problem
    // TODO - remove, it can leads to n+1 query problem
    @Bean
    public FilterRegistrationBean<OpenEntityManagerInViewFilter> registerOpenEntityManagerInViewFilterBean() {
        FilterRegistrationBean<OpenEntityManagerInViewFilter> registrationBean = new FilterRegistrationBean<>();
        OpenEntityManagerInViewFilter filter = new OpenEntityManagerInViewFilter();
        registrationBean.setFilter(filter);
        registrationBean.setOrder(5);
        return registrationBean;
    }

    @Bean
    public JavaMailSender getJavaMailSender() {

        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(port);
        mailSender.setUsername(username);
        mailSender.setPassword(password);

        Properties properties = mailSender.getJavaMailProperties();
        properties.put("mail.transport.protocol", "smtp");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.starttls.required", "true");
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.ssl.enable", "false");
        properties.put("mail.debug", "true");

        return mailSender;
    }

    // Configuration in application.properties
    @Bean(name = "multipartResolver")
    public StandardServletMultipartResolver multipartResolver() {
        return new StandardServletMultipartResolver();
    }
}

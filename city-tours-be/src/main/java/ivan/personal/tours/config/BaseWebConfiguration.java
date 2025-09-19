package ivan.personal.tours.config;

import ivan.personal.tours.utility.framework.AuditorAwareImpl;
import ivan.personal.tours.utility.framework.resolver.EnumExposedService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.web.filter.CommonsRequestLoggingFilter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public abstract class BaseWebConfiguration implements WebMvcConfigurer {
    @Bean
    public CommonsRequestLoggingFilter requestLoggingFilter() {
        CommonsRequestLoggingFilter loggingFilter = new CommonsRequestLoggingFilter();
        loggingFilter.setIncludeClientInfo(true);
        loggingFilter.setIncludeQueryString(true);
        loggingFilter.setIncludePayload(true);
        return loggingFilter;
    }

    @Bean
    public AuditorAware<String> auditorProvider() {
        return new AuditorAwareImpl();
    }

    @Bean
    public EnumExposedService getEnumExposedService() {
//        EnumExposedService service = new EnumExposedService();
//        service.init();
        return new EnumExposedService();
    }
}

package ivan.personal.tours.config;

import ivan.personal.tours.utility.multilanguage.ICurrentLocaleResolver;
import ivan.personal.tours.utility.multilanguage.RequestAttributesLocaleResolver;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;

@Configuration
public class BaseI18nConfiguration {

    @Bean
    public MessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();

        messageSource.setBasename("classpath:messages/messages");
        messageSource.setDefaultEncoding("UTF-8");

        return messageSource;
    }

    @Bean
    public ICurrentLocaleResolver currentLocaleResolver() {
        return new RequestAttributesLocaleResolver();
    }

}

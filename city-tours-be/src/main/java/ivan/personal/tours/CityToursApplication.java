package ivan.personal.tours;

import ivan.personal.tours.config.BaseI18nConfiguration;
import ivan.personal.tours.config.BaseMainConfiguration;
import ivan.personal.tours.config.BaseWebConfiguration;
import ivan.personal.tours.utility.framework.context.ApplicationContextProvider;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

import java.util.TimeZone;

@SpringBootApplication
@Import({BaseMainConfiguration.class, BaseI18nConfiguration.class, BaseWebConfiguration.class})
public class CityToursApplication {

    public static void main(String[] args) {
        ApplicationContextProvider.setStartupViaMain(true);
        SpringApplication.run(CityToursApplication.class, args);
    }

    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));   // It will set UTC timezone
    }
}

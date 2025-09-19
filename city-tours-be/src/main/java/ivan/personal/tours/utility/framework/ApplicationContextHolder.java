package ivan.personal.tours.utility.framework;

import ivan.personal.tours.utility.framework.context.ApplicationContextProvider;
import ivan.personal.tours.utility.multilanguage.ICurrentLocaleResolver;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Locale;
import java.util.Optional;


/**
 * Manage context information
 *
 */
public class ApplicationContextHolder {

    private ApplicationContextHolder() {
        throw new IllegalStateException("Utility class");
    }

    public static Locale getCurrentLocale() {
        Optional<Locale> locale = ApplicationContextProvider.getBean(ICurrentLocaleResolver.class).getCurrentLocale();
        if (locale.isEmpty()) {
            throw new RuntimeException("Locale not found");
        }
        return locale.get();
    }

    public static String getCurrentTimezone() {
        ServletRequestAttributes sra = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (sra == null)
            return "UTC";

        HttpServletRequest req = sra.getRequest();
        String reqTimezone = req.getHeader("timezone");
        if (reqTimezone == null)
            return "UTC";
        return reqTimezone;
    }
}
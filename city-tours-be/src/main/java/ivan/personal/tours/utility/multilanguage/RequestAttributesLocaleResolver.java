package ivan.personal.tours.utility.multilanguage;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Locale;
import java.util.Optional;

public class RequestAttributesLocaleResolver implements ICurrentLocaleResolver {

    @Override
    public Optional<Locale> getCurrentLocale() {
        ServletRequestAttributes sra = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        // es: system startup
        if (sra == null)
            return Optional.of(LocaleUtils.getItalianLocale());
        HttpServletRequest req = sra.getRequest();
        return Optional.of(req.getLocale());
    }

}

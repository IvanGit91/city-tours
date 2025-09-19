package ivan.personal.tours.utility.multilanguage;

import java.util.Locale;
import java.util.Optional;

public interface ICurrentLocaleResolver {

    Optional<Locale> getCurrentLocale();
}

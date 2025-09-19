package ivan.personal.tours.utility.multilanguage;

import ivan.personal.tours.utility.framework.ApplicationContextHolder;

import java.util.Locale;

public class LocaleUtils {
    private LocaleUtils() {
        throw new IllegalStateException("Utility class");
    }

    public static Locale toLocale(String languageCode) {
        if (languageCode.equalsIgnoreCase("IT"))
            return Locale.ITALY;
        return Locale.US;
    }

    public static Locale getItalianLocale() {
        return Locale.ITALY;
    }

    public static String getLanguageCountryTag() {
        Locale locale = ApplicationContextHolder.getCurrentLocale();
        return locale.getLanguage() + "_" + locale.getCountry();
    }

    public static String getLanguageTag() {
        return ApplicationContextHolder.getCurrentLocale().getLanguage();
    }
}

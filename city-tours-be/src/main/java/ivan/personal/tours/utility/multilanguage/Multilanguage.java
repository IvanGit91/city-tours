package ivan.personal.tours.utility.multilanguage;

import ivan.personal.tours.utility.framework.ApplicationContextHolder;
import ivan.personal.tours.utility.framework.context.ApplicationContextProvider;
import lombok.NonNull;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.core.io.ClassPathResource;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.*;

@Slf4j
public class Multilanguage {
    private Multilanguage() {
        throw new IllegalStateException("Multilanguage utility class");
    }

    public static String getMessage(Enum<?> message) {
        if (message == null)
            return "";
        try {
            return getMessage("enum." + message.name());
        } catch (Exception e) {
            return "LABEL_NOT_FOUND: " + message.name();
        }
    }


    /**
     * Get the translation of a message code based on the current locale.
     *
     * @param messageCode the message code to translate
     * @param locale the locale to use for the translation
     * @param args the arguments to be passed to the message translation
     * @return the translated message string, or "LABEL_NOT_FOUND: <messageCode>" if the translation is not found
     */
    public static String getMessage(String messageCode, Locale locale, @NonNull Object... args) {
        MessageSource ms = ApplicationContextProvider.getMessageSourceBean();
        try {
            return ms.getMessage(messageCode, args, locale);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return "LABEL_NOT_FOUND: " + messageCode;
        }
    }

    public static String getMessage(String messageCode, @NonNull Object... args) {
        return getMessage(messageCode, ApplicationContextHolder.getCurrentLocale(), args);
    }

    public static List<String> getEnumTranslated(Class<? extends Enum<?>> headerEnum) {
        List<String> headersTranslated = new ArrayList<>();
        final Enum<?>[] enumValues = headerEnum.getEnumConstants();
        for (Enum<?> enumValue : enumValues) {
            String enumTranslated = Multilanguage.getMessage(enumValue);
            headersTranslated.add(enumTranslated);
        }
        return headersTranslated;
    }

    public static Map<Enum<?>, String> getEnumToTranslations(Class<? extends Enum<?>> headerEnum) {
        Map<Enum<?>, String> result = new HashMap<>();
        final Enum<?>[] enumValues = headerEnum.getEnumConstants();
        for (Enum<?> enumValue : enumValues) {
            String enumTranslated = Multilanguage.getMessage(enumValue);
            result.put(enumValue, enumTranslated);
        }
        return result;
    }

    public static Enum<?> getEnumOfTranslated(Class<? extends Enum<?>> headerEnum, String translated) throws IllegalStateException {
        if (translated == null || translated.isEmpty())
            return null;
        Map<String, Enum<?>> enumValues = getTranslationToEnum(headerEnum);
        Enum<?> result = enumValues.get(translated);
        if (result == null)
            throw new IllegalStateException(Multilanguage.getMessage("enumValueNotFound", translated, enumValues.keySet()));
        return result;
    }

    public static Map<String, Enum<?>> getTranslationToEnum(Class<? extends Enum<?>> headerEnum) {
        Map<String, Enum<?>> result = new HashMap<>();
        final Enum<?>[] enumValues = headerEnum.getEnumConstants();
        for (Enum<?> enumValue : enumValues) {
            String enumTranslated = Multilanguage.getMessage(enumValue);
            result.put(enumTranslated, enumValue);
        }
        return result;
    }

    public static Optional<Enum<?>> getEnumOfTranslation(Class<? extends Enum<?>> headerEnum, String translation) {
        Map<Enum<?>, String> enumToTranslation = getEnumToTranslations(headerEnum);
        for (Enum e : enumToTranslation.keySet()) {
            String val = enumToTranslation.get(e).trim();
            if (val.equalsIgnoreCase(translation.trim()))
                return Optional.of(e);
        }
        return Optional.empty();
    }

    @SneakyThrows
    public static Properties getTranslationsToValue() {
        File properties = new ClassPathResource("messages/messages_" + LocaleUtils.getLanguageCountryTag() + ".properties").getFile();
        try (InputStream input = new FileInputStream(properties)) {
            Properties prop = new Properties();
            prop.load(input);
            return prop;
        }
    }

}
package ivan.personal.tours.annotation;

import jakarta.validation.Payload;

import java.lang.annotation.*;


@Target({ElementType.TYPE, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface EnumExposedViaRest {

    String message() default "";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    /**
     * Returns the name of the enum used in the API.
     * The enum will be exposed at the following URL: {microservice}/api/enum/{enumApiName}
     */
    String enumApiName();

    /**
     * Specifies whether the enum should include a multilingual description.
     * If true, the description must be included in the 'messages_it.properties' file using the notation enum.NAME = italian_translation.
     * Example: enum.ORDERED = Ordered
     */
    boolean multilanguageDescription();
}

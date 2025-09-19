package ivan.personal.tours.utility.framework.resolver;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ivan.personal.tours.annotation.EnumExposedViaRest;
import ivan.personal.tours.dto.EnumExposedResult;
import ivan.personal.tours.utility.Const;
import ivan.personal.tours.utility.framework.ApplicationContextHolder;
import ivan.personal.tours.utility.framework.ClassUtils;
import ivan.personal.tours.utility.framework.Utils;
import ivan.personal.tours.utility.multilanguage.Multilanguage;
import lombok.SneakyThrows;

import java.lang.reflect.Method;
import java.util.*;

public class EnumExposedService {

    private static final String ENUM_DESCRIPTION = "description";
    private Map<String, EnumExposedResult> exposedEnums;

    public synchronized void init() {
        Map<String, EnumExposedResult> result = new HashMap<>();
        Collection<Class> enumExposedClasses = ClassUtils.getPackageEnums(Const.MAIN_PACKAGE, List.of(EnumExposedViaRest.class.getSimpleName()));
        Locale currentLocale = ApplicationContextHolder.getCurrentLocale();
        Locale storedLocale = null;
        for (Class c : enumExposedClasses) {
            EnumExposedViaRest exp = (EnumExposedViaRest) c.getAnnotation(EnumExposedViaRest.class);
            List<Map<String, String>> fields = this.getEnumToFieldsList(c, currentLocale);
            String apiName = exp.enumApiName();
            if (exp.multilanguageDescription()) {
                storedLocale = currentLocale;
            }
            result.put(apiName, new EnumExposedResult(storedLocale, fields));
        }
        this.exposedEnums = result;
    }

    private String getEnumMessageCode(String valueName) {
        return "enum." + valueName;
    }

    public EnumExposedResult getEnumExposedResult(String enumApiName) {
        if (this.exposedEnums == null)
            this.init();

        EnumExposedResult result = this.exposedEnums.get(enumApiName);
        if (result == null) {
            throw new IllegalArgumentException("Cannot find an enum with apiName:" + enumApiName + ". Available enum names:" + this.exposedEnums.keySet());
        } else if (result.getStoredLocale() != null){
            Locale currentLocale = ApplicationContextHolder.getCurrentLocale();
            // If the locale is different from the one stored in the result, return the updated ones
            if (!result.getStoredLocale().equals(currentLocale)) {
                List<Map<String, String>> newData = result.getData().stream()
                        .map(map -> {
                            Map<String, String> newMap = new HashMap<>(map);
                            newMap.put(ENUM_DESCRIPTION, Multilanguage.getMessage(getEnumMessageCode(map.get("key")), currentLocale));
                            return newMap;
                        })
                        .toList();
                result.setData(newData);
            }
        }
        return result;
    }

    @SneakyThrows
    public List<Map<String, Object>> getEnumToFieldsList(Class<? extends Enum<?>> headerEnum, Locale currentLocale) {
        List<Map<String, Object>> result = new ArrayList<>();
        List<Method> methodsToExpose = ClassUtils.getPublicGetIsMethods(headerEnum);
        EnumExposedViaRest exp = headerEnum.getAnnotation(EnumExposedViaRest.class);

        final Enum<?>[] enumValues = headerEnum.getEnumConstants();
        for (Enum<?> enumValue : enumValues) {
            Map<String, Object> fields = new HashMap<>();

            for (Method method : methodsToExpose) {
                String methodName = method.getName();
                methodName = methodName.startsWith("get") ? methodName.replace("get", "") : methodName;
                methodName = methodName.startsWith("is") ? methodName.replace("is", "") : methodName;
                methodName = Utils.decapitalize(methodName);
                if (method.getAnnotation(JsonIgnore.class) == null)
                    fields.put(methodName, method.invoke(enumValue));
            }
            fields.put("key", enumValue.name());

            // add description if requested
            // TODO - multilanguage needs to be updated when locale changes
            if (exp.multilanguageDescription()) {
                String enumMessageCode = getEnumMessageCode(enumValue.name());
                fields.put(ENUM_DESCRIPTION, Multilanguage.getMessage(enumMessageCode, currentLocale));
            }
            result.add(fields);
        }

        if (exp.multilanguageDescription()) {
            result.sort(Comparator.comparing(a -> a.get(ENUM_DESCRIPTION).toString()));
        }
        return result;
    }
}

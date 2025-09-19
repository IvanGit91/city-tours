package ivan.personal.tours.utility.framework;

import lombok.SneakyThrows;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.RegexPatternTypeFilter;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.data.projection.SpelAwareProxyProjectionFactory;

import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.*;
import java.util.regex.Pattern;

public class ClassUtils {

    private static final List<String> numberTypes = new ArrayList<>();

    static {
        numberTypes.add("java.lang.Long");
        numberTypes.add("java.lang.Integer");
        numberTypes.add("java.lang.Double");
        numberTypes.add("java.lang.Float");
        numberTypes.add("java.math.BigDecimal");
    }

    private ClassUtils() {
        throw new IllegalStateException("ClassUtils utility class");
    }

    /**
     * Return all the classes present in the package
     *
     * @param packageName
     * @return
     */
    @SneakyThrows
    public static Collection<Class> getPackageClasses(String packageName, List<String> annotations) {
        Collection<Class> result = new HashSet<>();
        // create scanner and disable default filters (that is the 'false' argument)
        final ClassPathScanningCandidateComponentProvider provider = new ClassPathScanningCandidateComponentProvider(false);
        // add include filters which matches all the classes (or use your own)
        provider.addIncludeFilter(new RegexPatternTypeFilter(Pattern.compile(".*")));

        // get matching classes defined in the package
        final Set<BeanDefinition> classes = provider.findCandidateComponents(packageName);

        // this is how you can load the class type from BeanDefinition instance
        for (BeanDefinition bean : classes) {
            Class<?> clazz = Class.forName(bean.getBeanClassName());
            if (!annotations.isEmpty()) {
                List<String> declaredAnnotations = Arrays.stream(clazz.getAnnotations()).map(a -> a.annotationType().getSimpleName()).toList();
                if (!new HashSet<>(declaredAnnotations).containsAll(annotations))
                    continue;
            }
            result.add(clazz);
        }
        return result;
    }

    public static Collection<Class> getPackageEnums(String packageName, List<String> annotations) {
        Collection<Class> classes = getPackageClasses(packageName, annotations);
        classes.removeIf(c -> !c.isEnum());
        return classes;
    }

    public static List<Method> getPublicGetIsMethods(Class<?> clazz) {
        return Arrays.stream(clazz.getDeclaredMethods()).filter(m -> m.getParameterCount() == 0)
                .filter(m -> !Modifier.isStatic(m.getModifiers())).filter(m -> m.getName().startsWith("get") || m.getName().startsWith("is"))
                .filter(m -> Modifier.isPublic(m.getModifiers())).toList();
    }

    public static <R> R convertToProjection(Class<R> projectionClass, Object object) {
        ProjectionFactory pf = new SpelAwareProxyProjectionFactory();
        return pf.createProjection(projectionClass, object);
    }

}

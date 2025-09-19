package ivan.personal.tours.utility.utils;

import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.SneakyThrows;
import lombok.extern.java.Log;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Log
public class UReflection {
    private UReflection() {
        throw new UnsupportedOperationException("Utility class");
    }

    @SneakyThrows
    public static Object callGetter(Object obj, String fieldName) {
        PropertyDescriptor pd = new PropertyDescriptor(fieldName, obj.getClass());
        return pd.getReadMethod().invoke(obj);
    }

    @SneakyThrows
    public static void callSetter(Object obj, String fieldName, Object value) {
        PropertyDescriptor pd = new PropertyDescriptor(fieldName, obj.getClass());
        pd.getWriteMethod().invoke(obj, value);
    }

    @SneakyThrows
    public static <T> T callDefaultConstructor(Class<?> clazz) {
        return (T) clazz.getDeclaredConstructor().newInstance();
    }

    @SneakyThrows
    public static Object callGetterSuperclass(Object obj, String fieldName) {
        return obj.getClass().getSuperclass().getMethod("get" + UManipulation.capitalize(fieldName)).invoke(obj);
    }

    public static Optional<Field> getFirstAnnotatedField(Class<?> clazz, Class annotationClass) {
        return Arrays.stream(clazz.getDeclaredFields()).filter(f -> f.getDeclaredAnnotationsByType(annotationClass).length > 0).findFirst();
    }

    public static List<Field> getAnnotatedFields(Class<?> clazz, Class annotationClass) {
        return Arrays.stream(clazz.getDeclaredFields()).filter(f -> f.getDeclaredAnnotationsByType(annotationClass).length > 0).toList();
    }

    public static List<Field> getAnnotatedFields(Class<?> clazz, List<Class> annotationClass) {
        return Arrays.stream(clazz.getDeclaredFields()).filter(f -> annotationClass.stream().anyMatch(a -> f.getDeclaredAnnotationsByType(a).length > 0)).toList();
    }

    public static List<Field> equalsTargetClassFieldMappedBy(Class<?> clazz, String fieldName) {
        return Arrays.stream(clazz.getDeclaredFields()).filter(f -> {
            OneToOne oneToOne = f.getAnnotation(OneToOne.class);
            OneToMany oneToMany = f.getAnnotation(OneToMany.class);
            ManyToMany manyToMany = f.getAnnotation(ManyToMany.class);
            String mappedBy = oneToOne != null ? oneToOne.mappedBy() : oneToMany != null ? oneToMany.mappedBy() : manyToMany != null ? manyToMany.mappedBy() : "";
            return mappedBy.equals(fieldName);
        }).toList();
    }

    // ------------- NEW ------------------------- //
    public static List<Field> getListField(Class<?> clazz) {
        return Arrays.stream(clazz.getDeclaredFields())
                .filter(f -> f.getType().equals(List.class))
                .toList();
    }

    public static List<Field> getAnnotatedFieldsWithFilter(Class<?> clazz, List<Class> annotationClass, List<String> filters) {
        return Arrays.stream(clazz.getDeclaredFields()).filter(f -> filters.stream().noneMatch(n -> n.equals(f.getName())) && annotationClass.stream().anyMatch(a -> f.getDeclaredAnnotationsByType(a).length > 0)).toList();
    }
}

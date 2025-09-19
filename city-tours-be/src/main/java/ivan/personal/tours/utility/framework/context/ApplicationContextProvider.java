package ivan.personal.tours.utility.framework.context;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.MessageSource;
import org.springframework.core.ResolvableType;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ApplicationContextProvider implements ApplicationContextAware {

    @Setter
    @Getter
    private static ApplicationContext context;
    @Getter
    @Setter
    private static Boolean startupViaMain = false;

    public ApplicationContextProvider(ApplicationContext ctx) {
        setContext(ctx);
    }

    public static <T> T getBean(Class<T> clazz) {
        return context.getBean(clazz);
    }

    public static <T> T getBeanWithGenerics(Class<T> clazz, List<Class<?>> genericClasses) {
        Class[] classes = genericClasses.toArray(new Class[0]);
        String[] beans = context.getBeanNamesForType(ResolvableType.forClassWithGenerics(clazz, classes));
        return (T) context.getBean(beans[0]);
    }

    public static MessageSource getMessageSourceBean() {
        return (getBean(MessageSource.class));
    }

    @Override
    public void setApplicationContext(@NonNull ApplicationContext ac) throws BeansException {
        setContext(ac);
    }

}
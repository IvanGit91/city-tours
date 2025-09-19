package ivan.personal.tours.utility.framework;

public class Utils {
    private Utils() {
        throw new IllegalStateException("Utility class");
    }

    public static String decapitalize(String string) {
        if (string == null || string.isEmpty()) {
            return string;
        }
        char[] c = string.toCharArray();
        c[0] = Character.toLowerCase(c[0]);
        return new String(c);
    }

}

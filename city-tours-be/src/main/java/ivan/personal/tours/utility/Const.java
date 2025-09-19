package ivan.personal.tours.utility;

import java.io.File;

public class Const {
    private Const() {
        throw new UnsupportedOperationException("Utility class");
    }

    // LOCAL
    public static final String CATALINA_FOLDER = System.getProperty("user.dir") + File.separator;
    // SERVER
    public static final String CATALINA_FOLDER_PROD = System.getProperty("catalina.base") + File.separator;

    public static final String MAIN_PACKAGE = "ivan.personal.tours";
}

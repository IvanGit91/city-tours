package ivan.personal.tours.utility.utils;

import java.awt.*;
import java.util.Random;

public class UManipulation {
    private static final Random RANDOM = new Random();

    private UManipulation() {
        throw new UnsupportedOperationException("Utility class");
    }


    public static String capitalize(String str) {
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }

    // ------------- NEW ------------------------- //
    public static Color randomColor() {
        float r = RANDOM.nextFloat();
        float g = RANDOM.nextFloat();
        float b = RANDOM.nextFloat();
        return new Color(r, g, b);
    }

    public static String rgbToHex(Color color) {
        return "#" + Integer.toHexString(color.getRGB()).substring(2);
    }

}

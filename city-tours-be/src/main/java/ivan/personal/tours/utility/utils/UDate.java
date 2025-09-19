package ivan.personal.tours.utility.utils;

import lombok.extern.java.Log;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Log
public class UDate {
    private UDate() {
        throw new UnsupportedOperationException("Utility class");
    }

    // ------------- NEW ------------------------- //
    public static LocalDate tryParseLocalDate(String value, DateTimeFormatter formatter) {
        LocalDate localDate = null;
        try {
            localDate = LocalDate.parse(value, formatter);
        } catch (DateTimeParseException e) {
            e.printStackTrace();
        }
        return localDate;
    }
}

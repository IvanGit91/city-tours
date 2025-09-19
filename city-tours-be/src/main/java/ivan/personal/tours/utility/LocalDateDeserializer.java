package ivan.personal.tours.utility;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.io.Serial;
import java.time.LocalDate;
import java.time.ZonedDateTime;

public class LocalDateDeserializer extends StdDeserializer<LocalDate> {

    @Serial
    private static final long serialVersionUID = 1L;

    protected LocalDateDeserializer() {
        super(LocalDate.class);
    }


    @Override
    public LocalDate deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String parsed = p.getValueAsString();
        return ZonedDateTime.parse(parsed).toLocalDate();
    }

}
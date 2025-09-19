package ivan.personal.tours.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class EnumExposedResult {
    @JsonIgnore
    private Locale storedLocale;
    private List<Map<String, String>> data;
}


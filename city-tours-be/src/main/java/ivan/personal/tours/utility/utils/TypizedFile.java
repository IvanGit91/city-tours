package ivan.personal.tours.utility.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TypizedFile {
    private byte[] file;
    private String contentType;
}

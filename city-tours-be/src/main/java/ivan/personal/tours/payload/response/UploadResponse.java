package ivan.personal.tours.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UploadResponse implements Serializable {

    private String fileName;
    private String fileType;
    private String filePath;
    private long size;
}

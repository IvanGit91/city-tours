package ivan.personal.tours.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ErrorDTO {

    private Integer status;
    private String statusText;
    private String message;

}

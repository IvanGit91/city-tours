package ivan.personal.tours.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Psw {
    private String tempPassword;
    private String newPassword;
}

package ivan.personal.tours.payload.response;

import lombok.Data;

@Data
public class JwtResponse {
    private Long id;
    private String token;
    private String type = "Bearer";
    private String account;
    private String name;
    private String role;
    private Boolean verify;

    public JwtResponse(Long id, String token, String account, String name, String role, Boolean verify) {
        this.id = id;
        this.account = account;
        this.name = name;
        this.token = token;
        this.role = role;
        this.verify = verify;
    }
}

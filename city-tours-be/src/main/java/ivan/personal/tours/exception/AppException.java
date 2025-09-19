package ivan.personal.tours.exception;

import ivan.personal.tours.utility.multilanguage.Multilanguage;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpStatusCodeException;

@Getter
public class AppException extends HttpStatusCodeException {

    private final String message;
    private String code;

    public AppException(HttpStatus statusCode, String message) {
        super(statusCode);
        this.message = message;
    }

    public AppException(HttpStatus statusCode, String message, Object... params) {
        super(statusCode);
        this.message = Multilanguage.getMessage(message, params);
    }

    public AppException(HttpStatus statusCode, String code, String message) {
        this(statusCode, message);
        this.code = code;
    }
}

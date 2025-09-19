package ivan.personal.tours.exception;

import ivan.personal.tours.dto.ErrorDTO;
import jakarta.servlet.ServletException;
import lombok.extern.java.Log;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Arrays;

@RestControllerAdvice
@Log
public class ExceptionTranslator {

    @ExceptionHandler(AppException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorDTO processAppException(AppException e) {
        return new ErrorDTO(e.getStatusCode().value(), e.getStatusText(), e.getMessage());
    }

    @ExceptionHandler(ServletException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorDTO processServletException(ServletException e) {
        log.severe(Arrays.toString(e.getStackTrace()));
        return new ErrorDTO(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getCause().getMessage(), e.getMessage());
    }

}
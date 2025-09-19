package ivan.personal.tours.service.controller;

import ivan.personal.tours.model.News;
import ivan.personal.tours.model.User;
import ivan.personal.tours.service.UserService;
import ivan.personal.tours.utility.framework.AuthContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class NewsControllerService {

    private final UserService userService;

    public News checkNews(@RequestBody News news) {
        if (AuthContext.isAdmin() && news.getApprovalDate() == null)
            news.setApprovalDate(LocalDate.now());
        else if (AuthContext.isRedactor()) {
            User user = userService.findByUniqueIdAndFv(AuthContext.authName());
            news.setRedactor(user);
            news.setApprovalDate(null);
        }
        return news;
    }
}

package ivan.personal.tours.service.controller;


import ivan.personal.tours.model.Poi;
import ivan.personal.tours.model.User;
import ivan.personal.tours.service.UserService;
import ivan.personal.tours.service.framework.FileService;
import ivan.personal.tours.utility.framework.AuthContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class PoiControllerService {

    private final UserService userService;
    private final FileService fileService;

    public void setImage(Poi poi) {
        if (poi.getImagePath() != null)
            poi.setImage(fileService.getPublicResource(poi.getImagePath()));
    }

    public Poi checkPoi(@RequestBody Poi poi) {
        if (AuthContext.isAdmin() && poi.getApprovalDate() == null)
            poi.setApprovalDate(LocalDate.now());
        else if (AuthContext.isRedactor()) {
            poi.setApprovalDate(null);
            User user = userService.findByUniqueIdAndFv(AuthContext.authName());
            poi.setRedactor(user);
        }
        return poi;
    }

}

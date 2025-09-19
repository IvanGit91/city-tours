package ivan.personal.tours.service.controller;


import ivan.personal.tours.model.District;
import ivan.personal.tours.model.User;
import ivan.personal.tours.service.UserService;
import ivan.personal.tours.service.framework.FileService;
import ivan.personal.tours.utility.framework.AuthContext;
import ivan.personal.tours.utility.utils.UManipulation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DistrictControllerService {

    private final UserService userService;
    private final FileService fileService;

    public void setDistrictColor(District district) {
        final String randomColorHex;
        if (district.getColor() != null) {
            randomColorHex = "#" + district.getColor();
        } else if (!district.getGeos().isEmpty() && district.getGeos().get(0).getId() != null && district.getGeos().get(0).getProperties().getColor() != null) {
            randomColorHex = district.getGeos().get(0).getProperties().getColor();
        } else {
            randomColorHex = UManipulation.rgbToHex(UManipulation.randomColor());
        }
        district.setColor(randomColorHex);
        district.getGeos().forEach(geo -> geo.getProperties().setColor(randomColorHex));
    }

    public void setImage(District district) {
        if (district.getImagePath() != null)
            district.setImage(fileService.getPublicResource(district.getImagePath()));
        if (district.getLogoPath() != null)
            district.setLogo(fileService.getPublicResource(district.getLogoPath()));
    }

    public District checkDistrict(@RequestBody District district) {
        setDistrictColor(district);
        if (AuthContext.isAdmin() && district.getApprovalDate() == null)
            district.setApprovalDate(LocalDate.now());
        else if (AuthContext.isRedactor()) {
            User user = userService.findByUniqueIdAndFv(AuthContext.authName());
            district.setRedactor(user);
            district.setApprovalDate(null);
        }
        return district;
    }

}

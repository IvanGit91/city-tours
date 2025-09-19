package ivan.personal.tours.utility;

import lombok.Getter;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;

@Component
@Log
@Getter
public class Vars {

    private final String rootFolder;
    private final String uploadFolder;
    private final String deployFolder;
    private final String profile;
    private final String uploadResource;

    public Vars(@Value("${spring.profiles.active}") String profile,
                @Value("${app.upload-resource}") String uploadResource) {
        this.profile = profile;
        this.uploadResource = uploadResource;
        rootFolder = this.profile.equals("dev") ? Const.CATALINA_FOLDER : Const.CATALINA_FOLDER_PROD;
        uploadFolder = rootFolder + uploadResource + File.separator;
        deployFolder = rootFolder + "webapps" + File.separator;
    }

}

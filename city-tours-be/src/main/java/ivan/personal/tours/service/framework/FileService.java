package ivan.personal.tours.service.framework;

import ivan.personal.tours.exception.AppException;
import ivan.personal.tours.utility.Vars;
import ivan.personal.tours.utility.utils.TypizedFile;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Log
@Service
@RequiredArgsConstructor
public class FileService {

    private final Vars vars;

    public TypizedFile getPublicResource(String path) {
        String[] split = path.trim().replace(".", "/").split("/");
        String fileType = split[split.length - 1];

        String readFile = vars.getRootFolder() + path.replace("/", File.separator).trim();

        File file = new File(readFile);
        TypizedFile typizedFile = new TypizedFile();

        if (file.exists() && !file.isDirectory()) {
            try {
                typizedFile = new TypizedFile(Files.readAllBytes(Paths.get(readFile)), fileType);
            } catch (IOException exception) {
                log.info(exception.getMessage());
            }
        } else {
            throw new AppException(HttpStatus.NOT_FOUND, "file.not.found", readFile);
        }

        return typizedFile;
    }
}

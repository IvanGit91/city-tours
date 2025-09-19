package ivan.personal.tours.service.framework;

import ivan.personal.tours.exception.AppException;
import ivan.personal.tours.utility.Vars;
import lombok.SneakyThrows;
import lombok.extern.java.Log;
import net.lingala.zip4j.ZipFile;
import org.apache.commons.io.IOUtils;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.UUID;

@Log
@Service
public class UploadService {

    private final Vars vars;
    private final String[] fileMimeTypes = {"image/jpeg", "image/png"};
    private final String[] entityTypes = {"news", "district", "poi"};
    @Lazy
    @Autowired
    private UploadService self;  // Self-injection with @Lazy
    @Value("${app.upload-resource}")
    private String uploadResource;

    public UploadService(Vars vars) {
        this.vars = vars;
    }

    // The self call, fix the following error:
    // @Transactional self-invocation (in effect, a method within the target object calling another method of the target object) does not lead to an actual transaction at runtime
    public String saveFile(MultipartFile file, String entityType, Long entityId) throws IOException {
        return self.saveFile(file, entityType, entityId, null);
    }

    @Transactional
    public String saveFile(MultipartFile file, String entityType, Long entityId, String namePrefix) throws IOException {
        String fileMimeType = file.getContentType();
        if (!Arrays.asList(this.fileMimeTypes).contains(fileMimeType)
                || !Arrays.asList(this.entityTypes).contains(entityType) || entityType.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "file.not.supported");
        }

        String uploadFolder = vars.getUploadFolder() + entityType +
                File.separator + entityId + File.separator;
        String fileName = copyFile(file, uploadFolder);
        String finalPath = (this.uploadResource + File.separator + entityType +
                File.separator + entityId + File.separator + fileName).replace("\\", "/");
        log.info("File deployed: " + fileName);
        return finalPath;
    }

    @Transactional
    public void deleteDirectory(String path) throws IOException {
        if (!path.isEmpty()) {
            String[] parts = path.split("/");
            String mainDirectory = parts[0];
            String entityType = parts[1];
            String id = parts[2];
            FileUtils.deleteDirectory(new File(mainDirectory + File.separator + entityType + File.separator + id));
        }
    }

    @Transactional
    @SneakyThrows
    public void deployBackend(MultipartFile file) throws IOException {
        String uploadFolder = vars.getDeployFolder();
        String fileName = copyFile(file, uploadFolder);
        log.info("File deployed: " + fileName);
        log.info("BACKEND DEPLOYED SUCCESSFULLY");
    }

    @Transactional
    @SneakyThrows
    public void deployFrontend(MultipartFile file) throws IOException {
        // save file to temp
        File zip = File.createTempFile(UUID.randomUUID().toString(), "temp");
        FileOutputStream o = new FileOutputStream(zip);
        IOUtils.copy(file.getInputStream(), o);
        o.close();

        // unizp file from temp by zip4j
        String uploadFolder = vars.getDeployFolder();
        String fileName = file.getOriginalFilename();
        checkFile(fileName, uploadFolder);
        ZipFile zipFile = new ZipFile(zip);
        zipFile.extractAll(uploadFolder);
        log.info("FRONTEND DEPLOYED SUCCESSFULLY");
    }

    @SneakyThrows
    public String copyFile(MultipartFile file, String uploadFolder) {
        String fileName = file.getOriginalFilename();
        Path targetLocation = checkFile(fileName, uploadFolder);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        return fileName;
    }

    @SneakyThrows
    public Path checkFile(String fileName, String uploadFolder) {
        log.info("Filename to upload: " + fileName);
        String filePath = uploadFolder + fileName;
        log.info("Path of the file to upload: " + filePath);
        Path targetLocation = Paths.get(filePath);
        if (!Files.exists(targetLocation)) {
            Files.createDirectories(targetLocation);
        }
        return targetLocation;
    }
}
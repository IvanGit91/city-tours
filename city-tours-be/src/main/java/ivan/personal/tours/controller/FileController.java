package ivan.personal.tours.controller;

import ivan.personal.tours.service.framework.FileService;
import ivan.personal.tours.utility.utils.TypizedFile;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @GetMapping("/download")
    public TypizedFile getResource(@RequestParam("path") String path) {
        return fileService.getPublicResource(path);
    }
}

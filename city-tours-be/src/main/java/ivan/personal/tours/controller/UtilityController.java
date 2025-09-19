package ivan.personal.tours.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import ivan.personal.tours.model.City;
import ivan.personal.tours.service.CityService;
import ivan.personal.tours.service.framework.UploadService;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;

@RestController
@RequestMapping("/utility")
@RequiredArgsConstructor
public class UtilityController {

    private final CityService cityService;
    private final ResourceLoader resourceLoader;
    private final UploadService uploadService;

    @GetMapping("/cities")
    public List<City> cities() {
        return this.cityService.getBaseRepository().findAll();
    }

    @GetMapping("/cities/filter")
    public List<City> cities(@RequestParam String startsWith) {
        return this.cityService.findAllByNameStartsWith(startsWith);
    }

    @GetMapping("/italianLayer")
    @SneakyThrows
    public JsonNode italianLayer() {
        Resource resource = resourceLoader.getResource("classpath:italian-districts.geojson");
        InputStream jsonStream = resource.getInputStream();
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readTree(jsonStream);
    }

    @PostMapping(value = "/auth/upload/backend")
    @SneakyThrows
    public Boolean backend(@RequestParam("file") MultipartFile file) {
        uploadService.deployBackend(file);
        return true;
    }

    @PostMapping(value = "/auth/upload/frontend")
    @SneakyThrows
    public Boolean frontend(@RequestParam("file") MultipartFile file) {
        uploadService.deployFrontend(file);
        return true;
    }
}

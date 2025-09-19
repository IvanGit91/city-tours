package ivan.personal.tours.controller;

import ivan.personal.tours.exception.AppException;
import ivan.personal.tours.model.Poi;
import ivan.personal.tours.service.PoiService;
import ivan.personal.tours.service.controller.PoiControllerService;
import ivan.personal.tours.service.framework.UploadService;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/poi")
@RequiredArgsConstructor
public class PoiController {

    private final PoiService poiService;
    private final UploadService uploadService;
    private final PoiControllerService poiControllerService;

    @GetMapping(value = "/")
    public List<Poi> allPoi() {
        return poiService.findAllByFv();
    }

    @GetMapping(value = "/light")
    public List<Long> allPoiLight() {
        return poiService.findAllLight();
    }

    @GetMapping(value = "/orderedApprovalDate")
    public List<Poi> allPoiOrderedByApproval() {
        return poiService.findAllByFvOrderByApprovalDateAsc();
    }

    @GetMapping(value = "/redactor/{id}")
    public List<Poi> allByRedactorOrderedApprovalDate(@PathVariable("id") Long id) {
        return poiService.findByRedactorIdAndFvOrderByApprovalDateAsc(id);
    }

    @GetMapping(value = "/all/{districtId}")
    public List<Poi> allPoiByDistrictIdApproved(@PathVariable("districtId") Long districtId) {
        List<Poi> pois = poiService.findAllByDistrictIdAndApprovalDateIsNotNullAndFv(districtId);
        pois.forEach(poiControllerService::setImage);
        return pois;
    }

    @GetMapping(value = "/light/all/{districtId}")
    public List<Poi> allPoiLightByDistrictIdApproved(@PathVariable("districtId") Long districtId) {
        return poiService.findAllLightByDistrictIdAndApprovalDateIsNotNullAndFv(districtId);
    }

    @GetMapping(value = "/pageable")
    public Page<Poi> allPoiPageable(@RequestParam int page, @RequestParam int size) {
        return poiService.findAllByFv(page, size);
    }

    @GetMapping(value = "/{districtId}/pageable")
    public Page<Poi> allPoiByPoiPageableAndApproved(@PathVariable("districtId") Long districtId, @RequestParam int page, @RequestParam int size) {
        Page<Poi> pages = poiService.findByDistrictPageAndApproved(districtId, page, size);
        pages.getContent().forEach(poiControllerService::setImage);
        return pages;
    }

    @GetMapping(value = "/{idPoi}")
    public Poi poiById(@PathVariable("idPoi") Long idPoi) {
        Poi poi;
        Optional<Poi> poiOpt = poiService.findByIdAndFv(idPoi);
        if (poiOpt.isEmpty())
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found", "poi", idPoi.toString());
        poi = poiOpt.get();
        poiControllerService.setImage(poi);
        return poi;
    }

    @PostMapping(value = "/auth/")
    @Transactional
    public Poi createPoi(@RequestBody Poi poi) {
        return poiService.getBaseRepository().save(poiControllerService.checkPoi(poi));
    }

    @PutMapping(value = "/auth/{idPoi}")
    public Poi updatePoi(@PathVariable("idPoi") Long idPoi, @RequestBody Poi poi) {
        Optional<Poi> poiToUpdate = poiService.findByIdAndFv(idPoi);
        if (poiToUpdate.isEmpty())
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found", "poi", idPoi.toString());
        return poiService.getBaseRepository().saveAndFlush(poiControllerService.checkPoi(poi));
    }

    @Transactional
    @DeleteMapping(value = "/auth/{idPoi}")
    public Boolean deletePoi(@PathVariable("idPoi") Long idPoi) {
        Optional<Poi> poi = poiService.findByIdAndFv(idPoi);
        if (poi.isEmpty())
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found", "poi", idPoi.toString());
        poiService.getBaseRepository().deleteById(idPoi);
        poiService.getBaseRepository().flush();
        return true;
    }


    @Transactional
    @DeleteMapping(value = "/auth/logical/{id}")
    public Boolean logicalDeletePoi(@PathVariable("id") Long id) {
        Optional<Poi> poiOpt = poiService.findByIdAndFv(id);
        if (poiOpt.isEmpty())
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found", "poi", poiOpt.toString());
        poiService.logicalDeleteMulti(poiOpt.get(), List.of("district"));
        return true;
    }

    @PostMapping(value = "/auth/upload/{idPoi}")
    @SneakyThrows
    public Poi upload(@PathVariable("idPoi") Long idPoi, @RequestParam("file") MultipartFile file) {
        Poi poi;
        Optional<Poi> poiOpt = poiService.findByIdAndFv(idPoi);
        if (poiOpt.isEmpty()) {
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found", "poi", idPoi.toString());
        } else {
            poi = poiOpt.get();
            String finalPath = "";
            if (!file.isEmpty()) {
                finalPath = uploadService.saveFile(file, "poi", poi.getId());
            } else if (!poi.getImagePath().isBlank()) {
                uploadService.deleteDirectory(poi.getImagePath());
                finalPath = "";
            }
            poi.setImagePath(finalPath);
        }
        return poiService.getBaseRepository().saveAndFlush(poi);
    }

    @PatchMapping(value = "/auth/approvalDate/{id}")
    public Poi setApprovalDate(@PathVariable("id") Long id) {
        Optional<Poi> poiOpt = poiService.findByIdAndFv(id);
        if (poiOpt.isEmpty()) {
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found", "news", id.toString());
        }
        Poi poi = poiOpt.get();
        poi.setApprovalDate(LocalDate.now());
        poiService.getBaseRepository().saveAndFlush(poi);
        return poi;
    }
}
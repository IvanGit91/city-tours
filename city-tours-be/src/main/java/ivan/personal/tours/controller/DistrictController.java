package ivan.personal.tours.controller;

import ivan.personal.tours.enums.FV;
import ivan.personal.tours.exception.AppException;
import ivan.personal.tours.model.District;
import ivan.personal.tours.repository.PoiRepository;
import ivan.personal.tours.service.DistrictService;
import ivan.personal.tours.service.controller.DistrictControllerService;
import ivan.personal.tours.service.framework.UploadService;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/district")
@RequiredArgsConstructor
public class DistrictController {

    private final DistrictControllerService districtControllerService;
    private final DistrictService districtService;
    private final PoiRepository poiRepository;
    private final UploadService uploadService;

    @GetMapping(value = "/")
    public List<District> allDistrict() {
        return districtService.findAllByFv();
    }

    @GetMapping(value = "/approved")
    public List<District> allDistrictApproved() {
        return districtService.findAllByApprovalDateIsNotNullAndFv();
    }

    @GetMapping(value = "/orderedApprovalDate")
    public List<District> allOrderedByApprovalDate() {
        return districtService.findAllByFvOrderByApprovalDateAsc();
    }

    @GetMapping(value = "/redactor/{id}")
    public List<District> districtByRedactorOrderedApprovalDate(@PathVariable("id") Long id) {
        return districtService.findByRedactorIdAndFvOrderByApprovalDateAsc(id);
    }

    @GetMapping(value = "/{idDistrict}")
    public District districtById(@PathVariable("idDistrict") Long idDistrict) {
        Optional<District> districtOpt = districtService.findByIdAndFv(idDistrict);
        if (districtOpt.isEmpty())
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found", "district", idDistrict.toString());
        District district = districtOpt.get();
        districtControllerService.setImage(district);
        return district;
    }

    @PostMapping(value = "/auth/")
    @Transactional
    public District createDistrict(@RequestBody District district) {
        return districtService.save(districtControllerService.checkDistrict(district));
    }

    @PutMapping(value = "/auth/{idDistrict}")
    public District updateDistrict(@PathVariable("idDistrict") Long idDistrict, @RequestBody District district) {
        Optional<District> districtToUpdate = districtService.findByIdAndFv(idDistrict);
        if (districtToUpdate.isEmpty())
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found", "district", idDistrict.toString());
        return districtService.save(districtControllerService.checkDistrict(district));
    }

    @Transactional
    @DeleteMapping(value = "/auth/{idDistrict}")
    public Boolean deleteDistrict(@PathVariable("idDistrict") Long idDistrict) {
        Optional<District> district = districtService.findByIdAndFv(idDistrict);
        if (district.isEmpty())
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found", "district", idDistrict.toString());
        districtService.getBaseRepository().deleteById(idDistrict);
        districtService.getBaseRepository().flush();
        return true;
    }

    @Transactional
    @DeleteMapping(value = "/auth/logical/{id}")
    public Boolean logicalDeleteDistrict(@PathVariable("id") Long id) {
        if (poiRepository.existsByDistrictIdAndFv(id, FV.S)) {
            throw new AppException(HttpStatus.FORBIDDEN, "cannot.delete.fk");
        }
        Optional<District> district = districtService.findByIdAndFv(id);
        if (district.isEmpty())
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found", "district", district.toString());
        districtService.logicalDeleteMulti(district.get(), List.of());
        return true;
    }

    @PostMapping(value = "/auth/upload/{idDistrict}/{logo}")
    @SneakyThrows
    public District upload(@PathVariable("idDistrict") Long idDistrict, @PathVariable("logo") Boolean logo, @RequestParam("file") MultipartFile file) {
        Optional<District> district = districtService.findByIdAndFv(idDistrict);
        if (district.isEmpty()) {
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found", "district", idDistrict.toString());
        } else {
            String prefix = Boolean.TRUE.equals(logo) ? "logo_" : "image_";
            String path = Boolean.TRUE.equals(logo) ? district.get().getLogoPath() : district.get().getImagePath();
            String finalPath = "";
            if (!file.isEmpty()) {
                finalPath = uploadService.saveFile(file, "district", district.get().getId(), prefix);
            } else if (!path.isBlank()) {
                uploadService.deleteDirectory(path);
                finalPath = "";
            }

            if (Boolean.TRUE.equals(logo)) {
                districtService.updateLogoPath(district.get().getId(), finalPath);
            } else {
                districtService.updateImagePath(district.get().getId(), finalPath);
            }
        }
        return district.get();
    }

    @PatchMapping(value = "/auth/approvalDate/{id}")
    public District setApprovalDate(@PathVariable("id") Long id) {
        Optional<District> districtOpt = districtService.findByIdAndFv(id);
        if (districtOpt.isEmpty()) {
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found", "news", id.toString());
        }
        District district = districtOpt.get();
        district.setApprovalDate(LocalDate.now());
        districtService.getBaseRepository().saveAndFlush(district);
        return district;
    }
}
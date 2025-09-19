package ivan.personal.tours.controller;

import ivan.personal.tours.exception.AppException;
import ivan.personal.tours.model.geo.Geo;
import ivan.personal.tours.service.GeoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/geo")
@RequiredArgsConstructor
public class GeoController {

    private final GeoService geoService;

    @GetMapping(value = "/")
    public List<Geo> allGeo() {
        return geoService.findAllByFv();
    }

    @GetMapping(value = "/{idGeo}")
    public Geo geoById(@PathVariable("idGeo") Long idGeo) {
        Optional<Geo> geoOpt = geoService.findByIdAndFv(idGeo);
        if (geoOpt.isEmpty())
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found", "geo", idGeo.toString());
        return geoOpt.get();
    }

    @PostMapping(value = "/")
    public Geo createGeo(@RequestBody Geo geo) {
        return geoService.save(geo);
    }

    @PutMapping(value = "/{idGeo}")
    public Geo updateGeo(@PathVariable("idGeo") Long idGeo, @RequestBody Geo district) {
        Optional<Geo> districtToUpdate = geoService.findByIdAndFv(idGeo);
        if (districtToUpdate.isEmpty())
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found", "geo", idGeo.toString());
        return geoService.save(district);
    }

    @Transactional
    @DeleteMapping(value = "/{idGeo}")
    public Boolean deleteGeo(@PathVariable("idGeo") Long idGeo) {
        Optional<Geo> district = geoService.findByIdAndFv(idGeo);
        if (district.isEmpty())
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found", "geo", idGeo.toString());
        geoService.getBaseRepository().deleteById(idGeo);
        geoService.getBaseRepository().flush();
        return true;
    }

    @Transactional
    @DeleteMapping(value = "/all")
    public Boolean deleteListGeo(@RequestParam("ids") List<Long> ids) {
        ids.forEach(i -> {
            geoService.getBaseRepository().deleteById(i);
            geoService.getBaseRepository().flush();
        });
        return true;
    }

}
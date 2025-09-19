package ivan.personal.tours.service;

import ivan.personal.tours.model.geo.Geo;
import ivan.personal.tours.repository.BaseAuditableRepository;
import ivan.personal.tours.repository.BaseRepository;
import ivan.personal.tours.repository.GeoRepository;
import org.springframework.stereotype.Service;

@Service
public class GeoService extends BaseAuditableService<Geo, Long> {

    private final GeoRepository geoRepository;

    public GeoService(BaseRepository<Geo, Long> baseRepository,
                      BaseAuditableRepository<Geo, Long> baseAuditableRepository,
                      GeoRepository geoRepository) {
        super(baseRepository, baseAuditableRepository, Geo.class);
        this.geoRepository = geoRepository;
    }

}

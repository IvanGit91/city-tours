package ivan.personal.tours.repository;

import ivan.personal.tours.model.geo.Geo;
import org.springframework.stereotype.Repository;

@Repository
public interface GeoRepository extends BaseAuditableRepository<Geo, Long> {

}

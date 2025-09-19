package ivan.personal.tours.repository;

import ivan.personal.tours.enums.FV;
import ivan.personal.tours.model.Poi;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PoiRepository extends BaseAuditableRepository<Poi, Long> {

    List<Poi> findAllByDistrictIdAndApprovalDateIsNotNullAndFv(Long id, FV fv);

    @Query(value = "SELECT new Poi(p.id, p.denomination, p.type, p.geo) FROM Poi p WHERE p.district.id = ?1 AND p.approvalDate IS NOT NULL AND p.fv = 'S'")
    List<Poi> findAllLightByDistrictIdAndApprovalDateIsNotNullAndFv(Long id);

    @Query(value = "SELECT p FROM Poi p WHERE p.district.id = ?1 AND approvalDate IS NOT NULL AND fv = 'S'")
    Page<Poi> findByDistrictPageAndApproved(Long id, Pageable page);

    List<Poi> findAllByFvOrderByApprovalDateAsc(FV fv);

    List<Poi> findByRedactorIdAndFvOrderByApprovalDateAsc(Long id, FV fv);

    boolean existsByDistrictIdAndFv(Long id, FV fv);
}

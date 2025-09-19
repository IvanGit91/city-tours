package ivan.personal.tours.service;

import ivan.personal.tours.enums.FV;
import ivan.personal.tours.model.Poi;
import ivan.personal.tours.repository.BaseAuditableRepository;
import ivan.personal.tours.repository.BaseRepository;
import ivan.personal.tours.repository.PoiRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PoiService extends BaseAuditableService<Poi, Long> {
    private final PoiRepository poiRepository;

    public PoiService(BaseRepository<Poi, Long> baseRepository,
                      BaseAuditableRepository<Poi, Long> baseAuditableRepository,
                      PoiRepository poiRepository) {
        super(baseRepository, baseAuditableRepository, Poi.class);
        this.poiRepository = poiRepository;
    }

    public List<Poi> findAllByDistrictIdAndApprovalDateIsNotNullAndFv(Long districtId) {
        return poiRepository.findAllByDistrictIdAndApprovalDateIsNotNullAndFv(districtId, FV.S);
    }

    public List<Poi> findAllLightByDistrictIdAndApprovalDateIsNotNullAndFv(Long districtId) {
        return poiRepository.findAllLightByDistrictIdAndApprovalDateIsNotNullAndFv(districtId);
    }

    public Page<Poi> findByDistrictPageAndApproved(Long districtId, int page, int size) {
        Pageable paging = PageRequest.of(page, size);
        return poiRepository.findByDistrictPageAndApproved(districtId, paging);
    }

    public List<Poi> findAllByFvOrderByApprovalDateAsc() {
        return poiRepository.findAllByFvOrderByApprovalDateAsc(FV.S);
    }

    public List<Poi> findByRedactorIdAndFvOrderByApprovalDateAsc(Long id) {
        return poiRepository.findByRedactorIdAndFvOrderByApprovalDateAsc(id, FV.S);
    }

    public boolean existsByDistrictIdAndFv(Long id, FV fv) {
        return poiRepository.existsByDistrictIdAndFv(id, fv);
    }
}

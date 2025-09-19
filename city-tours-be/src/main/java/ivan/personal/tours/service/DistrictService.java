package ivan.personal.tours.service;

import ivan.personal.tours.enums.FV;
import ivan.personal.tours.model.District;
import ivan.personal.tours.repository.BaseAuditableRepository;
import ivan.personal.tours.repository.BaseRepository;
import ivan.personal.tours.repository.DistrictRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DistrictService extends BaseAuditableService<District, Long> {

    private final DistrictRepository districtRepository;

    public DistrictService(BaseRepository<District, Long> baseRepository,
                           BaseAuditableRepository<District, Long> baseAuditableRepository,
                           DistrictRepository districtRepository) {
        super(baseRepository, baseAuditableRepository, District.class);
        this.districtRepository = districtRepository;
    }

    @Transactional
    public int updateImagePath(Long id, String path) {
        return districtRepository.updateImagePath(id, path);
    }

    @Transactional
    public int updateLogoPath(Long id, String path) {
        return districtRepository.updateLogoPath(id, path);
    }

    public List<District> findAllByFvOrderByApprovalDateAsc() {
        return districtRepository.findAllByFvOrderByApprovalDateAsc(FV.S);
    }

    public List<District> findByRedactorIdAndFvOrderByApprovalDateAsc(Long id) {
        return districtRepository.findByRedactorIdAndFvOrderByApprovalDateAsc(id, FV.S);
    }

    public boolean existsByPoisIdAndPoisFv(Long id, FV fv) {
        return districtRepository.existsByPoisDistrictIdAndPoisFv(id, fv);
    }

    public List<District> findAllByApprovalDateIsNotNullAndFv() {
        return districtRepository.findAllByApprovalDateIsNotNullAndFv(FV.S);
    }
}

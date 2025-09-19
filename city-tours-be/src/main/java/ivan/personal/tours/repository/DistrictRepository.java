package ivan.personal.tours.repository;

import ivan.personal.tours.enums.FV;
import ivan.personal.tours.model.District;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DistrictRepository extends BaseAuditableRepository<District, Long> {

    @Modifying
    @Query("UPDATE District d SET d.imagePath = ?2 WHERE d.id = ?1")
    int updateImagePath(Long id, String path);

    @Modifying
    @Query("UPDATE District d SET d.logoPath = ?2 WHERE d.id = ?1")
    int updateLogoPath(Long id, String path);

    List<District> findAllByFvOrderByApprovalDateAsc(FV fv);

    List<District> findByRedactorIdAndFvOrderByApprovalDateAsc(Long id, FV fv);

    boolean existsByPoisDistrictIdAndPoisFv(Long id, FV fv);

    List<District> findAllByApprovalDateIsNotNullAndFv(FV fv);
}

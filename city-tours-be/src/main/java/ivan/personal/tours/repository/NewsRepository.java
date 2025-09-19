package ivan.personal.tours.repository;

import ivan.personal.tours.enums.FV;
import ivan.personal.tours.model.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends BaseAuditableRepository<News, Long> {

    List<News> findAllByRedactorIdAndFv(Long id, FV fv);

    List<News> findAllByFvAndApprovalDateIsNotNull(FV fv);

    Page<News> findAllByFvAndApprovalDateIsNotNull(FV fv, Pageable paging);
}

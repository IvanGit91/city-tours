package ivan.personal.tours.repository;

import ivan.personal.tours.enums.FV;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

@NoRepositoryBean
public interface BaseAuditableRepository<T, ID extends Serializable> extends BaseRepository<T, ID> {
    @Modifying
    @Query("UPDATE #{#entityName} d SET d.fv = 'N' WHERE d.id = ?1")
    int deleteLogical(ID id);

    boolean existsByIdAndFv(Long id, String fv);

    Optional<T> findByIdAndFv(Long id, FV fv);

    List<T> findAllByFv(FV fv);

    Page<T> findAllByFv(FV fv, Pageable pageable);
}

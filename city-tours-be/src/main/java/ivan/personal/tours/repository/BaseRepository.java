package ivan.personal.tours.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;

import java.io.Serializable;
import java.util.List;

@NoRepositoryBean
public interface BaseRepository<T, ID extends Serializable> extends JpaRepository<T, ID> {
    // COUNT
    @Query("select count(e) from #{#entityName} e")
    Long countAll();

    Page<T> findAll(Pageable pageable);

    @Query("select e.id from #{#entityName} e")
    List<Long> findAllLight();
}

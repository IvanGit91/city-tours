package ivan.personal.tours.repository;

import ivan.personal.tours.model.City;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CityRepository extends BaseRepository<City, Long> {

    List<City> findTop100ByNameStartsWithOrderByName(String startsWith);

}

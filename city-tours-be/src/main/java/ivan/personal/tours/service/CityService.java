package ivan.personal.tours.service;

import ivan.personal.tours.model.City;
import ivan.personal.tours.repository.BaseRepository;
import ivan.personal.tours.repository.CityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CityService extends BaseService<City, Long> {

    private final CityRepository cityRepository;

    public CityService(BaseRepository<City, Long> baseRepository, CityRepository cityRepository) {
        super(baseRepository, City.class);
        this.cityRepository = cityRepository;
    }

    public List<City> findAllByNameStartsWith(String startsWith) {
        return cityRepository.findTop100ByNameStartsWithOrderByName(startsWith);
    }
}

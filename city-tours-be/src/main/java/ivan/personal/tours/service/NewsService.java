package ivan.personal.tours.service;

import ivan.personal.tours.enums.FV;
import ivan.personal.tours.model.News;
import ivan.personal.tours.repository.BaseAuditableRepository;
import ivan.personal.tours.repository.BaseRepository;
import ivan.personal.tours.repository.NewsRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NewsService extends BaseAuditableService<News, Long> {

    private final NewsRepository newsRepository;

    public NewsService(BaseRepository<News, Long> baseRepository,
                       BaseAuditableRepository<News, Long> baseAuditableRepository,
                       NewsRepository newsRepository) {
        super(baseRepository, baseAuditableRepository, News.class);
        this.newsRepository = newsRepository;
    }

    public List<News> findAllByRedactorIdAndFv(Long id) {
        return newsRepository.findAllByRedactorIdAndFv(id, FV.S);
    }

    public List<News> findAllByFvAndApprovalDate() {
        return newsRepository.findAllByFvAndApprovalDateIsNotNull(FV.S);
    }

    public Page<News> findAllByFvAndApprovalDateIsNotNull(int page, int size) {
        Pageable paging = PageRequest.of(page, size);
        return newsRepository.findAllByFvAndApprovalDateIsNotNull(FV.S, paging);
    }
}

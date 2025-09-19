package ivan.personal.tours.controller;

import ivan.personal.tours.exception.AppException;
import ivan.personal.tours.model.News;
import ivan.personal.tours.service.NewsService;
import ivan.personal.tours.service.controller.NewsControllerService;
import ivan.personal.tours.service.framework.FileService;
import ivan.personal.tours.service.framework.UploadService;
import ivan.personal.tours.utility.utils.DateSorter;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/news")
@RequiredArgsConstructor
@Log
public class NewsController {

    private final NewsService newsService;
    private final NewsControllerService newsControllerService;
    private final UploadService uploadService;
    private final FileService fileService;

    @GetMapping(value = "/")
    public List<News> allNews() {
        List<News> newsList = newsService.findAllByFv();
        newsList.sort(new DateSorter());
        return newsList;
    }

    @GetMapping(value = "/{idNews}")
    public News newsById(@PathVariable("idNews") Long idNews) {
        Optional<News> newsOpt = newsService.findByIdAndFv(idNews);
        if (newsOpt.isEmpty()) {
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found", "news", idNews.toString());
        }
        return newsOpt.get();
    }

    @PostMapping(value = "/auth/")
    public News createNews(@RequestBody News news) {
        news.setPathImage("");
        return newsService.save(newsControllerService.checkNews(news));
    }

    @PutMapping(value = "/auth/{idNews}")
    public News updateNews(@PathVariable("idNews") Long idNews, @RequestBody News news) {
        Optional<News> newsOtp = newsService.findByIdAndFv(idNews);
        if (newsOtp.isEmpty()) {
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found", "news", idNews.toString());
        }
        return newsService.getBaseAuditableRepository().saveAndFlush(newsControllerService.checkNews(news));
    }

    @Transactional
    @DeleteMapping(value = "/auth/{idNews}")
    public News deleteNews(@PathVariable("idNews") Long idNews) {
        Optional<News> news = newsService.getBaseRepository().findById(idNews);
        if (news.isEmpty()) {
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found", "news", idNews.toString());
        }
        try {
            if (!news.get().getPathImage().isEmpty()) {
                uploadService.deleteDirectory(news.get().getPathImage());
            }
        } catch (IOException exception) {
            log.info(exception.getMessage());
        }
        newsService.getBaseRepository().deleteById(idNews);
        newsService.getBaseRepository().flush();
        return news.get();
    }

    @Transactional
    @DeleteMapping(value = "/auth/logical/{id}")
    public Boolean logicalDeleteNews(@PathVariable("id") Long id) {
        Optional<News> news = newsService.findByIdAndFv(id);
        if (news.isEmpty()) {
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found", "news", news.toString());
        }
        try {
            if (!news.get().getPathImage().isEmpty()) {
                uploadService.deleteDirectory(news.get().getPathImage());
            }
        } catch (IOException exception) {
            log.info(exception.getMessage());
        }
        newsService.logicalDeleteMulti(news.get(), List.of());
        return true;
    }

    @PostMapping(value = "/auth/upload/{idNews}")
    public News setImage(@PathVariable("idNews") Long idNews, @RequestParam("file") MultipartFile fileImg) {
        Optional<News> news = newsService.findByIdAndFv(idNews);
        if (news.isEmpty()) {
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found", "news", idNews.toString());
        } else {
            try {
                if (!fileImg.isEmpty()) {
                    news.get().setPathImage(uploadService.saveFile(fileImg, "news", news.get().getId()));
                } else if (!news.get().getPathImage().isEmpty()) {
                    uploadService.deleteDirectory(news.get().getPathImage());
                    news.get().setPathImage("");
                } else {
                    news.get().setPathImage("");
                }
            } catch (IOException ioException) {
                log.info(ioException.getMessage());
            }
        }
        newsService.getBaseRepository().saveAndFlush(news.get());
        return news.get();
    }

    @PutMapping(value = "/auth/setDate/{idNews}")
    public News setApprovalDate(@PathVariable("idNews") Long idNews) {
        LocalDate current = LocalDate.now();
        Optional<News> newsOpt = newsService.findByIdAndFv(idNews);
        if (newsOpt.isEmpty()) {
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found", "news", idNews.toString());
        }
        newsOpt.get().setApprovalDate(current);
        return newsService.getBaseAuditableRepository().saveAndFlush(newsOpt.get());
    }

    @GetMapping(value = "/pageable")
    public Page<News> allNewsPageable(@RequestParam int page, @RequestParam int size) {
        Page<News> news = newsService.findAllByFvAndApprovalDateIsNotNull(page, size);
        news.getContent().forEach(n -> {
            if (n.getPathImage() != null && !n.getPathImage().isEmpty()) {
                n.setImage(fileService.getPublicResource(n.getPathImage()));
            }
        });
        return news;
    }

    @GetMapping(value = "/auth/redactor/{idUser}")
    public List<News> newsByRedactorId(@PathVariable("idUser") Long idUser) {
        List<News> news = newsService.findAllByRedactorIdAndFv(idUser);
        if (news.isEmpty()) {
            throw new AppException(HttpStatus.NOT_FOUND, "entity.not.found", "user", idUser.toString());
        }
        return news;
    }

    @GetMapping(value = "/newsByApprovalDate")
    public List<News> allNewsByApprovalDate() {
        return newsService.findAllByFvAndApprovalDate();
    }

}
package ivan.personal.tours.controller;

import ivan.personal.tours.dto.SearchDTO;
import ivan.personal.tours.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping(value = "/do")
    public List<SearchDTO> search(@RequestParam String value) {
        return searchService.search(value);
    }
}
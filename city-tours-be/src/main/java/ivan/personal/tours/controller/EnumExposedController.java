package ivan.personal.tours.controller;

import ivan.personal.tours.dto.EnumExposedResult;
import ivan.personal.tours.utility.framework.resolver.EnumExposedService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class EnumExposedController {

    private final EnumExposedService service;

    @GetMapping("/enum/{enumName}")
    public EnumExposedResult getEnum(@PathVariable("enumName") String enumName) {
        return this.service.getEnumExposedResult(enumName);
    }
}

package ivan.personal.tours.enums;


import ivan.personal.tours.annotation.EnumExposedViaRest;
import lombok.AllArgsConstructor;
import lombok.Getter;


@EnumExposedViaRest(enumApiName = "poiType", multilanguageDescription = true)
@Getter
@AllArgsConstructor
public enum POI_TYPE {
    Storico,
    Culturale
}

package ivan.personal.tours.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ASSOCIATION_ENUM {
    ONE_TO_ONE,
    ONE_TO_MANY,
    MANY_TO_ONE,
    MANY_TO_ONE_TO_MANY,
    MANY_TO_MANY
}

package ivan.personal.tours.dto;

import ivan.personal.tours.enums.ASSOCIATION_ENUM;
import ivan.personal.tours.model.base.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FieldList<T extends BaseEntity<?>> {
    private String fieldName;
    private String mappedBy;
    private List<T> list;
    private boolean idNull;
    private ASSOCIATION_ENUM association;
    private Object id;  // Generally needs the many to many with additional fields
    private String mapFieldName;  // Generally needs the many to many with additional fields
}

package ivan.personal.tours.service;

import ivan.personal.tours.dto.SearchDTO;
import ivan.personal.tours.enums.FV;
import ivan.personal.tours.model.District;
import ivan.personal.tours.model.News;
import ivan.personal.tours.model.Poi;
import ivan.personal.tours.model.Role;
import ivan.personal.tours.utility.utils.UDate;
import ivan.personal.tours.utility.utils.UReflection;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Service
@Log
public class SearchService {

    private static final String DATE_REGEX_ENG = "^((?:19|20)\\d\\d)[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$";
    private static final String DATE_REGEX_ITA = "^(?:(?:31(\\/|-|\\.)(?:0?[13578]|1[02]))\\1|(?:(?:29|30)(\\/|-|\\.)(?:0?[13-9]|1[0-2])\\2))(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^(?:29(\\/|-|\\.)0?2\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\\d|2[0-8])(\\/|-|\\.)(?:(?:0?[1-9])|(?:1[0-2]))\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$";
    private static final List<DateTimeFormatter> DATE_FORMATTER_LIST = List.of(DateTimeFormatter.ofPattern("yyyy-MM-dd"),
            DateTimeFormatter.ofPattern("dd-MM-yyyy"));
    private final List<Class<?>> classes = List.of(News.class, District.class, Poi.class);
    @PersistenceContext
    private EntityManager entityManager;

    public List<SearchDTO> search(String value) {
        List<SearchDTO> entities = new ArrayList<>();
        List<Predicate> predicates = new ArrayList<>();
        Predicate predicate;
        List<Field> fields, embeddedFields;

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<SearchDTO> query = cb.createQuery(SearchDTO.class);
        for (Class<?> clazz : classes) {
            embeddedFields = UReflection.getAnnotatedFields(clazz, List.of(Embedded.class));
            fields = new ArrayList<>(UReflection.getAnnotatedFields(clazz, List.of(Column.class)));
            fields.addAll(embeddedFields);

            if (!fields.isEmpty()) {
                Root<?> root = query.from(clazz);
                for (Field field : fields) {
                    if ((predicate = operation(cb, root, field, value)) != null) {
                        predicates.add(predicate);
                    }
                }
                query.select(cb.construct(SearchDTO.class, cb.literal(clazz.getSimpleName().toLowerCase()).alias("type"), root.alias("elems")))
                        .where(cb.or(predicates.toArray(new Predicate[0])), cb.and(cb.isNotNull(root.get("approvalDate")), cb.equal(root.get("fv"), FV.S)));
                entities.addAll(entityManager.createQuery(query).getResultList());
                query = cb.createQuery(SearchDTO.class);
                predicates.clear();
            }
        }
        return entities;
    }

    private Predicate operation(CriteriaBuilder cb, Root<?> root, Field field, String value) {
        Predicate predicate = null;
        if (field.getType().equals(LocalDate.class)) {
            LocalDate date = null;
            int counter = 0;
            if (value.matches(DATE_REGEX_ENG) || value.matches(DATE_REGEX_ITA)) {
                while (date == null && counter < DATE_FORMATTER_LIST.size()) {
                    date = UDate.tryParseLocalDate(value, DATE_FORMATTER_LIST.get(counter));
                    counter++;
                }
            }
            if (date != null) {
                predicate = cb.equal(root.get(field.getName()), date);
            }
        } else if (field.getType().equals(String.class)) {
            predicate = cb.like(root.get(field.getName()), "%" + value + "%");
        } else if (field.getType().isEnum()) {
            Enum<?> refEnum = Stream.of(field.getType().getEnumConstants())
                    .map(e -> (Enum<?>) e)
                    .filter(e -> e.name().toLowerCase().equals(value)).findFirst().orElse(null);
            if (refEnum != null) {
                predicate = cb.equal(root.get(field.getName()), refEnum);
            }
        } else {
            // Manage only one level of embedded
            Embedded embedded = field.getAnnotation(Embedded.class);
            if (embedded != null) {
                List<Field> fields = UReflection.getAnnotatedFields(field.getType(), List.of(Column.class));
                for (Field f : fields) {
                    predicate = cb.like(root.get(field.getName()).get(f.getName()), value);
                }
            } else {
                log.warning("NOT EXPECTED CASE");
                predicate = cb.like(root.get(field.getName()), value);
            }

        }
        return predicate;
    }


    @Deprecated
    public List<Object> searchStatic(String value) {
        List<Predicate> predicates = new ArrayList<>();

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Object> query = cb.createQuery();

        Root<News> newsRoot = null;
        Root<Role> roleRoot = null;


        List<Field> fields = UReflection.getAnnotatedFields(News.class, List.of(Column.class));
        if (!fields.isEmpty()) {
            newsRoot = query.from(News.class);
            for (Field field : fields) {
                if (!field.getType().equals(LocalDate.class)) {
                    predicates.add(cb.and(cb.like(newsRoot.get(field.getName()), value)));
                }
            }
        }
        query.select(newsRoot).where(cb.or(predicates.toArray(new Predicate[0])));
        List<Object> entities = new ArrayList<>(entityManager.createQuery(query).getResultList());

        query = cb.createQuery();
        predicates.clear();
        fields = UReflection.getAnnotatedFields(Role.class, List.of(Column.class));
        if (!fields.isEmpty()) {
            roleRoot = query.from(Role.class);
            for (Field field : fields) {
                if (!field.getType().equals(LocalDate.class)) {
                    predicates.add(cb.and(cb.like(roleRoot.get(field.getName()), value)));
                }
            }
        }

        query.select(roleRoot).where(cb.or(predicates.toArray(new Predicate[0])));
        entities.addAll(entityManager.createQuery(query).getResultList());
        return entities;
    }

}

package ivan.personal.tours.service;


import ivan.personal.tours.annotation.UniqueId;
import ivan.personal.tours.enums.FV;
import ivan.personal.tours.model.base.BaseAuditableEntity;
import ivan.personal.tours.model.base.BaseEntity;
import ivan.personal.tours.repository.BaseAuditableRepository;
import ivan.personal.tours.repository.BaseRepository;
import ivan.personal.tours.utility.framework.context.ApplicationContextProvider;
import ivan.personal.tours.utility.utils.UReflection;
import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import lombok.Getter;
import lombok.extern.java.Log;
import org.hibernate.Hibernate;
import org.hibernate.proxy.HibernateProxy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Log
public abstract class BaseAuditableService<T extends BaseEntity<ID>, ID extends Serializable> extends BaseService<T, ID> {
    @Getter
    private final BaseAuditableRepository<T, ID> baseAuditableRepository;
    @Getter
    private final Class<T> type;
    @PersistenceContext
    private EntityManager entityManager;

    protected BaseAuditableService(BaseRepository<T, ID> baseRepository,
                                   BaseAuditableRepository<T, ID> baseAuditableRepository,
                                   Class<T> type) {
        super(baseRepository, type);
        this.baseAuditableRepository = baseAuditableRepository;
        this.type = type;
    }

    public Optional<T> findByIdAndFv(Long id) {
        return baseAuditableRepository.findByIdAndFv(id, FV.S);
    }

    public List<T> findAllByFv() {
        return baseAuditableRepository.findAllByFv(FV.S);
    }

    public Page<T> findAllByFv(int page, int size) {
        Pageable paging = PageRequest.of(page, size);
        return baseAuditableRepository.findAllByFv(FV.S, paging);
    }

    public T findByUniqueIdAndFv(Object uniqueId) {
        T entity = null;
        Optional<Field> field = UReflection.getFirstAnnotatedField(type, UniqueId.class);
        if (field.isPresent()) {
            CriteriaBuilder cb = entityManager.getCriteriaBuilder();
            CriteriaQuery<T> query = cb.createQuery(type);
            Root<T> root = query.from(type);
            query.select(root)
                    .where(cb.and(cb.equal(root.get(field.get().getName()), uniqueId),
                            cb.equal(root.get("fv"), FV.S)));
            TypedQuery<T> typedQuery = entityManager.createQuery(query);
            entity = typedQuery.getSingleResult();
        }
        return entity;
    }

    public ID logicalDeleteMulti(T entity, List<String> filters) {
        if (entity instanceof BaseAuditableEntity) {
            List<Field> fields = UReflection.getAnnotatedFieldsWithFilter(entity.getClass(), List.of(OneToOne.class, OneToMany.class), filters);
            List<T> entityList = new ArrayList<>();
            String fieldName;
            if (!fields.isEmpty()) {
                for (Field field : fields) {
                    fieldName = field.getName();
                    OneToOne oneToOneAnnotation = field.getAnnotation(OneToOne.class);
                    OneToMany oneToManyAnnotation = field.getAnnotation(OneToMany.class);
                    if (entityList == null) {
                        entityList = new ArrayList<>();
                    }
                    if (oneToOneAnnotation != null && Arrays.asList(oneToOneAnnotation.cascade()).contains(CascadeType.ALL)) {
                        T oneEntity = (T) UReflection.callGetter(entity, fieldName);
                        entityList.add(oneEntity);
                    } else if (oneToManyAnnotation != null && Arrays.asList(oneToManyAnnotation.cascade()).contains(CascadeType.ALL)) {
                        entityList = (List<T>) UReflection.callGetter(entity, fieldName);
                    }

                    if (entityList != null && !entityList.isEmpty()) {
                        for (T nextEntity : entityList) {
                            if (nextEntity instanceof HibernateProxy) {
                                Hibernate.initialize(nextEntity);
                                nextEntity = (T) ((HibernateProxy) nextEntity)
                                        .getHibernateLazyInitializer()
                                        .getImplementation();
                            }
                            logicalDeleteMulti(nextEntity, filters);
                        }
                    }
                }
            }
            BaseAuditableRepository<T, ID> baseRuntimeAuditableRepository = ApplicationContextProvider.getBeanWithGenerics(BaseAuditableRepository.class, List.of(entity.getClass(), entity.getId().getClass()));
            baseRuntimeAuditableRepository.deleteLogical(entity.getId());
        } else {
            log.warning("Ensure to extend BaseAuditableEntity");
        }
        return entity.getId();
    }
}

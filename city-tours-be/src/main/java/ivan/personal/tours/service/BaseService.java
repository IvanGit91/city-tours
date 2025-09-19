package ivan.personal.tours.service;


import ivan.personal.tours.annotation.UniqueId;
import ivan.personal.tours.dto.FieldList;
import ivan.personal.tours.enums.ASSOCIATION_ENUM;
import ivan.personal.tours.model.base.BaseEntity;
import ivan.personal.tours.model.base.BaseOriginalEntity;
import ivan.personal.tours.repository.BaseRepository;
import ivan.personal.tours.utility.framework.context.ApplicationContextProvider;
import ivan.personal.tours.utility.utils.UReflection;
import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import lombok.Getter;
import lombok.extern.java.Log;
import org.hibernate.proxy.HibernateProxy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Log
public abstract class BaseService<T extends BaseEntity<ID>, ID extends Serializable> {
    @Getter
    private final BaseRepository<T, ID> baseRepository;
    @Getter
    private final Class<T> type;
    @PersistenceContext
    private EntityManager entityManager;

    protected BaseService(BaseRepository<T, ID> baseRepository, Class<T> type) {
        this.baseRepository = baseRepository;
        this.type = type;
    }

    public Page<T> findAll(int page, int size) {
        Pageable paging = PageRequest.of(page, size);
        return getBaseRepository().findAll(paging);
    }

    public List<Long> findAllLight() {
        return baseRepository.findAllLight();
    }

    public T findByUniqueId(Object uniqueId) {
        T entity = null;
        Optional<Field> field = UReflection.getFirstAnnotatedField(type, UniqueId.class);
        if (field.isPresent()) {
            CriteriaBuilder cb = entityManager.getCriteriaBuilder();
            CriteriaQuery<T> query = cb.createQuery(type);
            Root<T> root = query.from(type);
            query.select(root)
                    .where(cb.equal(root.get(field.get().getName()), uniqueId));
            TypedQuery<T> typedQuery = entityManager.createQuery(query);
            entity = typedQuery.getSingleResult();
        }
        return entity;
    }

    public T save(T entity) {
        return saveOrUpdateMulti(entity, null) == null ? getBaseRepository().save(entity) : entity;
    }

    // If it has multiple fields at multiple levels of depth
    // TODO - recursive without reference id are not persisted
    public ID saveOrUpdateMulti(T entity, String prevMappedBy) {
        ID id = entity.getId(), idBack = null;
        String fieldName, mappedBy = "", manyToManyEmbeddedIdField, manyToManyMapFieldName = "";
        Class<?> manyToManyMapFieldClass;
        ASSOCIATION_ENUM association;
        EmbeddedId embeddedId = null;
        T embeddedIdEntity = null, nextEntity;
        List<T> entityList = new ArrayList<>();
        List<FieldList<T>> lists = new ArrayList<>();
        List<Field> fields;

        fields = UReflection.getAnnotatedFields(entity.getClass(), EmbeddedId.class);
        if (!fields.isEmpty()) {
            Field f = fields.get(0); // Should exist only one case in which there are many-to-many with additional fields
            embeddedId = f.getAnnotation(EmbeddedId.class);
            if (embeddedId != null) {
                manyToManyEmbeddedIdField = f.getName();
                manyToManyMapFieldClass = f.getType();
                embeddedIdEntity = (T) UReflection.callGetter(entity, manyToManyEmbeddedIdField);
                if (embeddedIdEntity == null) {  // Case without passing embeddedID field (embeddedId)
                    embeddedIdEntity = UReflection.callDefaultConstructor(manyToManyMapFieldClass);
                    UReflection.callSetter(entity, manyToManyEmbeddedIdField, embeddedIdEntity); // Call the constructor of embeddedID field if null
                }
            }
        }
        fields = UReflection.getAnnotatedFields(entity.getClass(), List.of(OneToOne.class, OneToMany.class, ManyToOne.class, ManyToMany.class));
        if (fields.isEmpty()) { // If it hasn't field to check, it returns
            return null;
        } else {
            for (Field field : fields) {
                fieldName = field.getName();
                ID fieldID = null;
                OneToOne oneToOneAnnotation = field.getAnnotation(OneToOne.class);
                ManyToMany manyToManyAnnotation = field.getAnnotation(ManyToMany.class);
                OneToMany oneToManyAnnotation = field.getAnnotation(OneToMany.class);
                ManyToOne manyToOneAnnotation = field.getAnnotation(ManyToOne.class); // for the one-to-many association
                MapsId mapsId = field.getAnnotation(MapsId.class); // for the manyToMany with additional fields
                if (oneToOneAnnotation != null || manyToOneAnnotation != null) {
                    if (entityList == null) {
                        entityList = new ArrayList<>();
                    }
                    if (!entityList.isEmpty()) {
                        entityList.clear();
                    }
                    T oneEntity = (T) UReflection.callGetter(entity, fieldName);
                    if (oneToOneAnnotation != null) {
                        association = ASSOCIATION_ENUM.ONE_TO_ONE;
                        mappedBy = oneToOneAnnotation.mappedBy();
                    } else { // MANY_TO_ONE
                        if (mapsId != null) {
                            association = ASSOCIATION_ENUM.MANY_TO_ONE_TO_MANY;
                            manyToManyMapFieldName = mapsId.value();
                        } else
                            association = ASSOCIATION_ENUM.MANY_TO_ONE;
                    }
                    if (oneEntity != null) {
                        fieldID = oneEntity.getId();
                        entityList.add(oneEntity);
                    }
                } else {
                    if (oneToManyAnnotation != null) {
                        association = ASSOCIATION_ENUM.ONE_TO_MANY;
                        mappedBy = oneToManyAnnotation.mappedBy();
                    } else { // MANY-TO-MANY
                        association = ASSOCIATION_ENUM.MANY_TO_MANY;
                        mappedBy = manyToManyAnnotation.mappedBy();
                    }
                    entityList = (List<T>) UReflection.callGetter(entity, fieldName);
                }
                // For the annotation that do not have the mappedBy, I find the mapped field by exploiting that they have the same class
                if (entityList != null && !entityList.isEmpty()) {
                    for (int i = 0; i < entityList.size(); i++) {
                        nextEntity = entityList.get(i);
                        if (!(nextEntity instanceof HibernateProxy)) {
                            List<Field> fieldsMappedBy = UReflection.equalsTargetClassFieldMappedBy(nextEntity.getClass(), fieldName);
                            if (mappedBy.isEmpty() && !fieldsMappedBy.isEmpty()) {
                                mappedBy = fieldsMappedBy.get(0).getName();
                            }
                            if (!mappedBy.isEmpty() && !nextEntity.getClass().equals(entity.getClass()) && (prevMappedBy == null || !prevMappedBy.equals(fieldName))) { // If it has recursion, don't check elements otherwise it goes in loop
                                idBack = saveOrUpdateMulti(nextEntity, mappedBy); //Do recursion and check field by field
                            }
                        } else {
                            entityList.remove(i--);
                        }
                    }

                    if (!entityList.isEmpty()) {
                        // In this way also update works
                        lists.add(new FieldList<>(fieldName, mappedBy, new ArrayList<>(entityList), id == null, association, idBack, manyToManyMapFieldName));
                        // If the id is still null, save it and make the list null
                        if (id == null && fieldID == null) {
                            UReflection.callSetter(entity, fieldName, null);
                        }
                    }
                }
            }

            // Save the entity added
            if (id == null) {
                if (embeddedId != null) {  // Many-to-many association with additional fields
                    T finalEmbeddedIdEntity = embeddedIdEntity;
                    lists.stream().filter(e -> e.getAssociation().equals(ASSOCIATION_ENUM.MANY_TO_ONE_TO_MANY))
                            .forEach(e -> {
                                UReflection.callSetter(finalEmbeddedIdEntity, e.getMapFieldName(), e.getId());
                                UReflection.callSetter(entity, e.getFieldName(), e.getList().get(0));
                            });
                    if (prevMappedBy == null)
                        getBaseRepository().save(entity);
                } else
                    getBaseRepository().save(entity);
            }
            // Reset the entities, it associates to the entity added and save the associations
            if (!lists.isEmpty()) {
                // ONE_TO_ONE
                lists.stream().filter(e -> e.getAssociation().equals(ASSOCIATION_ENUM.ONE_TO_ONE))
                        .forEach(e -> {
                            e.getList().forEach(l -> UReflection.callSetter(l, e.getMappedBy(), entity));
                            if (e.isIdNull())
                                UReflection.callSetter(entity, e.getFieldName(), e.getList().get(0));
                        });
                // MANY_TO_ONE
                lists.stream().filter(e -> e.getAssociation().equals(ASSOCIATION_ENUM.MANY_TO_ONE))
                        .forEach(e -> {
                            if (e.isIdNull())
                                UReflection.callSetter(entity, e.getFieldName(), e.getList().get(0));
                        });
                // ONE_TO_MANY
                lists.stream().filter(e -> e.getAssociation().equals(ASSOCIATION_ENUM.ONE_TO_MANY))
                        .forEach(e -> {
                            e.getList().forEach(l -> UReflection.callSetter(l, e.getMappedBy(), entity));
                            if (e.isIdNull())
                                UReflection.callSetter(entity, e.getFieldName(), e.getList());

                            // Delete old entities
                            if (entity.getClass().getSuperclass() != null && entity instanceof BaseOriginalEntity) {
                                BaseOriginalEntity<T, ID> orgEntity = (BaseOriginalEntity<T, ID>) entity;
                                T originalEntity = orgEntity.getOriginalObj();
                                if (originalEntity != null) {
                                    List<T> originalEntityList = (List<T>) UReflection.callGetter(originalEntity, e.getFieldName());
                                    if (!e.getList().isEmpty() || !originalEntityList.isEmpty()) {
                                        Class<?> repoClass = !e.getList().isEmpty() ? e.getList().get(0).getClass() : originalEntityList.get(0).getClass();
                                        Class<?> idClass = !e.getList().isEmpty() ? e.getList().get(0).getId().getClass() : originalEntityList.get(0).getId().getClass();
                                        BaseRepository<T, ID> baseDynamicRepository = ApplicationContextProvider.getBeanWithGenerics(BaseRepository.class, List.of(repoClass, idClass));
                                        originalEntityList.stream().filter(oElem -> e.getList().stream().noneMatch(aElem -> aElem.getId().equals(oElem.getId())))
                                                .forEach(oElem -> baseDynamicRepository.deleteById(oElem.getId()));
                                    }
                                }
                            }
                        });
                // MANY_TO_MANY
                lists.stream().filter(e -> e.getAssociation().equals(ASSOCIATION_ENUM.MANY_TO_MANY))
                        .forEach(e -> {
                            List<T> tempList = new ArrayList<>();
                            tempList.add(entity);
                            e.getList().forEach(l -> UReflection.callSetter(l, e.getMappedBy(), tempList));
                            if (e.isIdNull())
                                UReflection.callSetter(entity, e.getFieldName(), e.getList());
                        });

                if (embeddedId == null || prevMappedBy == null)
                    getBaseRepository().save(entity);
            }
        }
        return entity.getId();
    }
}

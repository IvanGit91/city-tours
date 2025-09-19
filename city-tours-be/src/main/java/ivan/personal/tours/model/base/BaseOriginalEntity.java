package ivan.personal.tours.model.base;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.monitorjbl.json.JsonView;
import com.monitorjbl.json.JsonViewSerializer;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PostLoad;
import jakarta.persistence.Transient;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.SneakyThrows;

import java.io.Serializable;

import static com.monitorjbl.json.Match.match;

@EqualsAndHashCode(callSuper = true)
@MappedSuperclass
@Data
public abstract class BaseOriginalEntity<T, ID extends Serializable> extends BaseEntity<ID> {

    @Transient
    @JsonIgnore
    private T originalObj;

    @PostLoad
    @SneakyThrows
    public void onLoad() {
        ObjectMapper mapper = new ObjectMapper();
        SimpleModule module = new SimpleModule();
        module.addSerializer(JsonView.class, new JsonViewSerializer());
        mapper.registerModule(module);
        String serialized = mapper.writeValueAsString(JsonView.with(this)
                .onClass(this.getClass(), match().exclude("geos.geometry.coordinates")));
        setOriginalObj((T) mapper.readValue(serialized, this.getClass()));
    }
}
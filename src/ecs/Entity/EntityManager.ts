import { IEntity } from "./IEntity";
import { IComponent } from "./IComponent";
import { ArrayHelpers } from "../../helpers";
import { EntityTypeManager } from "./EntityTypeManager";

export class EntityManager {

    private componentsByType = new WeakMap<Function, IComponent[]>();
    private entitiesByComponentType = new WeakMap<Function, IEntity[]>();
    private newestEntityVersions = new Map<Symbol, IEntity>();
    private componentsByEntity = new WeakMap<IEntity, IComponent[]>();
    private entityTypeManager = new EntityTypeManager();

    public setComponent<T extends Object>(entity: IEntity, component: T) {
        const ComponentType = component.constructor;
        const componentsByType = this.componentsByType.get(ComponentType);
        const entitiesByComponentType = this.entitiesByComponentType.get(ComponentType);
        const prevEntity = this.newestEntityVersions.get(entity.id) || entity;
        let newestEntity: IEntity = {
            id: prevEntity.id,
            version: prevEntity.version + 1,
            type: prevEntity.type,
        };

        let newComponentsByType;
        let newEntitiesByComponentType;

        // --------------------------------------------------------------------------------------------------------------------------------
        // Update components and entities by component type
        if (!componentsByType) {
            newComponentsByType = [component];
            newEntitiesByComponentType = [newestEntity];
        }
        else {
            const prevEntityIndex = ArrayHelpers.findIndex<IEntity>(entitiesByComponentType, otherEntity => otherEntity.id === entity.id);

            if (prevEntityIndex === -1) {
                newComponentsByType = [...componentsByType, component];
                newEntitiesByComponentType = [...entitiesByComponentType, newestEntity];
            }
            else {
                newComponentsByType = ArrayHelpers.splice(componentsByType, prevEntityIndex, component);
                newEntitiesByComponentType = ArrayHelpers.splice(entitiesByComponentType, prevEntityIndex, newestEntity);
            }
        }

        // --------------------------------------------------------------------------------------------------------------------------------
        // Update entity
        const componentsByEntity = this.componentsByEntity.get(prevEntity);
        let newComponentsByEntity;

        if (!componentsByEntity) newComponentsByEntity = [component];
        else {
            const prevComponentIndex = ArrayHelpers.findIndex(componentsByEntity, v => v.constructor === ComponentType);

            if (prevComponentIndex === -1) newComponentsByEntity = [...componentsByEntity, component];
            else newComponentsByEntity = ArrayHelpers.splice(componentsByEntity, prevComponentIndex, component);
        }

        newestEntity.type = this.entityTypeManager.getEntityTypeId(newComponentsByEntity.map(c => c.constructor));

        // --------------------------------------------------------------------------------------------------------------------------------
        // Finally, set data
        this.componentsByType.set(ComponentType, newComponentsByType);
        this.entitiesByComponentType.set(ComponentType, newEntitiesByComponentType);
        this.newestEntityVersions.set(newestEntity.id, newestEntity);
        this.componentsByEntity.set(newestEntity, newComponentsByEntity);
    }
    public getComponent(entity: IEntity, ComponentType: Function) {}
    public unsetComponent(entity: IEntity, ComponentType: Function) {}
    public hasComponent(entity: IEntity, ComponentType: Function) {}

    public createEntity(): IEntity {
        return {
            id: Symbol(),
            version: 0,
            type: undefined,
        };
    }

}

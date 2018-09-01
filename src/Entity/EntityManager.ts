import { ArrayHelpers } from "../helpers";

export interface IEntity {
    id: Symbol;
    version: number;
    name?: string;
}

export interface IComponentData {
    new(): any;
}

export class EntityManager {

    private componentsByType = new WeakMap<Function, IComponentData[]>();
    private componentsByEntity = new WeakMap<IEntity, IComponentData[]>();
    private entitiesByType = new WeakMap<Function, IEntity[]>();

    public setComponent(entity: IEntity, data: any) {
        const ComponentType = data.constructor;

        const componentsByType = this.componentsByType.get(ComponentType) || [];
        const componentsByEntity = this.componentsByEntity.get(entity) || [];
        const entitiesByType = this.entitiesByType.get(ComponentType) || [];

        // if (!componentsByType || !componentsByEntity) return;

        let componentByTypeIndex = ArrayHelpers.findIndex<IComponentData>(componentsByType, (v, index) => {
            // console.log(v, index);
            return entitiesByType[index].id === entity.id
        });
        if (componentByTypeIndex === -1) componentByTypeIndex = componentsByType.length;
        const newComponentsByType = ArrayHelpers.splice(componentsByType, componentByTypeIndex, data);

        let componentByEntityIndex = ArrayHelpers.findIndex<IComponentData>(componentsByEntity, v => v.constructor === ComponentType);
        if (componentByEntityIndex === -1) componentByEntityIndex = componentsByEntity.length;
        const newComponentsByEntity = ArrayHelpers.splice(componentsByEntity, componentByEntityIndex, data);

        let entityByTypeIndex = ArrayHelpers.findIndex<IEntity>(entitiesByType, v => v.id === entity.id);
        if (entityByTypeIndex === -1) entityByTypeIndex = entitiesByType.length;
        const newEntitiesByType = ArrayHelpers.splice(entitiesByType, entityByTypeIndex, entity);

        this.componentsByType.set(ComponentType, newComponentsByType);
        this.componentsByEntity.set(entity, newComponentsByEntity);
        this.entitiesByType.set(ComponentType, newEntitiesByType);
    }

    public unsetComponent(entity: IEntity, ComponentType: Function) {
        const componentsByEntity = this.componentsByEntity.get(entity);
        const componentByEntityIndex = ArrayHelpers.findIndex(componentsByEntity, component => component.constructor === ComponentType);

        if (componentByEntityIndex === -1) return;

        const componentsByType = this.componentsByType.get(ComponentType);
        const entitiesByType = this.entitiesByType.get(ComponentType);

        const componentByTypeIndex = ArrayHelpers.findIndex(componentsByType, (v, index) => entitiesByType[index].id === entity.id);
        const entityByTypeIndex = ArrayHelpers.findIndex(entitiesByType, (v, index) => v.id === entity.id);

        const newComponentsByEntity = ArrayHelpers.splice(componentsByEntity, componentByEntityIndex);
        const newComponentsByType = ArrayHelpers.splice(componentsByType, componentByTypeIndex);
        const newEntitiesByType = ArrayHelpers.splice(entitiesByType, entityByTypeIndex);

        this.componentsByEntity.set(entity, newComponentsByEntity);
        this.componentsByType.set(ComponentType, newComponentsByType);
        this.entitiesByType.set(ComponentType, newEntitiesByType);
    }

    public hasComponent(entity: IEntity, ComponentType: Function) {
        const componentsByEntity = this.componentsByEntity.get(entity);
        return componentsByEntity.some(component => component.constructor === ComponentType);
    }

    public getComponentsByEntity(entity: IEntity): ReadonlyArray<IComponentData> {
        return this.componentsByEntity.get(entity);
    }

    public getComponentsByType(ComponentType: Function): ReadonlyArray<IComponentData> {
        return this.componentsByType.get(ComponentType);
    }

    public getEntitiesByType(ComponentType: Function): ReadonlyArray<IEntity> {
        return this.entitiesByType.get(ComponentType);
    }

}

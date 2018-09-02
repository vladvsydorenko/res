import { IComponentTypeId } from "./IComponentTypeId";

export class EntityTypeManager {

    private idByType = new WeakMap<Function, IComponentTypeId>();
    private lastIndex = 0;

    public setComponentTypeId(Type: Function): IComponentTypeId {
        let componentTypeId = this.idByType.get(Type);

        if (componentTypeId) return componentTypeId;

        componentTypeId = {
            id: this.lastIndex.toString(),
            index: this.lastIndex,
        };

        this.idByType.set(Type, componentTypeId);
        this.lastIndex += 1;

        return componentTypeId;
    }

    public getComponentTypeId(Type: Function): IComponentTypeId | undefined {
        return this.idByType.get(Type);
    }

    public getEntityTypeId(Types: Function[]): string {
        return Types
            .map((Type) => {
                const id = this.setComponentTypeId(Type);
                return id;
            })
            .sort((a, b) => {
                if (a.index === b.index) return 0;
                if (a.index < b.index) return -1;
                if (a.index > b.index) return 1;
            })
            .map(id => id.id)
            .join("-");
    }

}

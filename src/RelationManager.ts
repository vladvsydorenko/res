import { THash, TId } from "./types";
import { ArrayHelpers } from "./helpers";

export class RelationManager {

    public sources: THash<TId[]> = {};
    public targets: THash<TId[]> = {};

    public setTargets(parentId: TId, childrenIds: TId[]) {
        this.targets[<string>parentId] = childrenIds;

        childrenIds.forEach(targetId => {
            this.sources[<string>targetId] = ArrayHelpers.pushUnique(parentId, this.sources[<string>targetId] || []);
        });
    }

    public setSources(childId: TId, parentIds: TId[]) {
        this.sources[<string>childId] = parentIds;

        parentIds.forEach(sourceId => {
            this.targets[<string>sourceId] = ArrayHelpers.pushUnique(childId, this.targets[<string>sourceId] || []);
        });
    }

}

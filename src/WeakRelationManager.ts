import { THash, TId } from "./types";
import { ArrayHelpers } from "./helpers";

export class WeakRelationManager<T extends Object> {

    public sources: THash<T[]> = {};
    public targets = new WeakMap<T, TId[]>();

    public setTargets(sourceId: T, childrenIds: TId[]) {
        this.targets.set(sourceId, childrenIds);

        childrenIds.forEach(targetId => {
            this.sources[<string>targetId] = ArrayHelpers.pushUnique(sourceId, this.sources[<string>targetId] || []);
        });
    }

    public setSources(targetId: TId, sourceIds: T[]) {
        this.sources[<string>targetId] = sourceIds;

        sourceIds.forEach(fn => {
            const values = this.targets.get(fn) || [];
            this.targets.set(fn, ArrayHelpers.pushUnique(targetId, values || []));
        });
    }

    public getTargets(sourceId: T) {
        return this.targets.get(sourceId) || [];
    }

    public getSources(targetId: TId) {
        return this.sources[<string>targetId] || [];
    }

}

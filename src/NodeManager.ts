import { RelationManager } from "./RelationManager";
import { TId } from "./types";

export class NodeManager<T> {

    private nodeRelations = new RelationManager();

    public setNodeTargets(nodeId: TId, targetNodeIds: TId[]) {
        this.nodeRelations.setTargets(nodeId, targetNodeIds);
    }

    public getNodeTargets(nodeId: TId) {
        return this.nodeRelations.targets[<string>nodeId];
    }

    public setNodeSources(nodeId: TId, sourceNodeIds: TId[]) {
        this.nodeRelations.setSources(nodeId, sourceNodeIds);
    }

    public getNodeSources(nodeId: TId) {
        return this.nodeRelations.sources[<string>nodeId];
    }

}

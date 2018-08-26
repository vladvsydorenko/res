import { RelationManager } from "./RelationManager";
import { TId, THash } from "./types";

export class NodeManager<T> {

    private nodes: THash<any> = {};
    private transforms: THash<any> = {};

    private nodeConnections = new RelationManager();
    private transformConnections = new RelationManager();

    // -----------------------------------------------------------------------
    // Relations
    // -----------------------------------------------------------------------

    public setNodeTargets(nodeId: TId, targetNodeIds: TId[]) {
        this.nodeConnections.setTargets(nodeId, targetNodeIds);
    }

    public getNodeTargets(nodeId: TId) {
        return this.nodeConnections.getTargets(nodeId);
    }

    public setNodeSources(nodeId: TId, sourceNodeIds: TId[]) {
        this.nodeConnections.setSources(nodeId, sourceNodeIds);
    }

    public getNodeSources(nodeId: TId) {
        return this.nodeConnections.sources[<string>nodeId];
    }

    // -----------------------------------------------------------------------
    // Transforms
    // -----------------------------------------------------------------------

    public setNodeTransforms(nodeId: TId, transformIds: TId[]) {
        this.transformConnections.setTargets(nodeId, transformIds);
    }
    public setTransformNodes(transformId: TId, nodeIds: TId[]) {
        this.transformConnections.setSources(transformId, nodeIds);
    }
    public getNodeTransforms(nodeId: TId) {
        return this.transformConnections.getTargets(nodeId);
    }
    public getTransformNodes(transformId: TId) {
        return this.transformConnections.getSources(transformId);
    }
}

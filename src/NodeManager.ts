import { THash, TId, inserthUnique, insertUniqueInHash } from "./helpers";

export interface INodeManagerBulkAction {
    setNodes?: any[];

    setNodeTransforms?: any[];
    insertNodeTransforms?: any[];
    registerNodeTransforms?: any[];

    setConnections?: any[];
    insertConnections?: any[];
}

export interface INodeManagerNode<T> {
    id: TId;
    value: T;
}

export class NodeManager<T = any[]> {

    private nodes: THash<INodeManagerNode<T>> = {};
    private transforms: THash<any> = {};

    private topNodes: TId[] = [];

    private sourceToTargets: THash<TId[]> = {};
    private targetToSources: THash<TId[]> = {};
    private nodeToTransforms: THash<TId[]> = {};

    public setNode(node: INodeManagerNode<T>, source = node) {
        this.nodes[<string>node.id] = node;

        if (!this.hasSources(node.id)) this.topNodes = inserthUnique(node.id, this.topNodes);
    }
    public getNode(nodeId: TId) {
        return this.nodes[<string>nodeId];
    }

    public setNodeTransforms(...args: any[]) {}
    public insertNodeTransforms(...args: any[]) {}
    public registerNodeTransforms(...args: any[]) {}

    public setConnections(sourceNodeId: TId, targetNodeIds: TId[]) {
        this.sourceToTargets[<string>sourceNodeId] = targetNodeIds;

        targetNodeIds.forEach(targetNodeId => {
            this.targetToSources = insertUniqueInHash(sourceNodeId, targetNodeId, this.targetToSources);
        });
    }
    public insertConnections(sourceNodeId: TId, targetNodeIds: TId[]) {
        const actualTargets = this.sourceToTargets[<string>sourceNodeId] || [];
        this.setConnections(sourceNodeId, [...actualTargets, ...targetNodeIds]);
    }

    public bulk(action: INodeManagerBulkAction) {}

    // recalculate everything
    public recalculate() {}

    private hasSources(nodeId: TId): boolean {
        return !!this.targetToSources[<string>nodeId];
    }
}
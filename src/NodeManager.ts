import { RelationManager } from "./RelationManager";
import { TId, THash } from "./types";

export interface INode<T> {
    id: TId;
    value: T;
}

export type TTransform<T> = (
    newNode: INode<T>,
    oldNode: INode<T>,
    sourceNode: INode<T>,
    nodeManager: NodeManager<T>
) => INode<T>;

export class NodeManager<T> {

    private nodes: THash<INode<T>> = {};
    private transforms: THash<TTransform<T>> = {};

    private nodeConnections = new RelationManager();
    private transformConnections = new RelationManager();

    // -----------------------------------------------------------------------
    // Nodes
    // -----------------------------------------------------------------------
    public setNode(node: INode<T>, source = node) {
        const nodeId = <string>node.id;

        const newNode = this.applyTransforms(node, source);

        this.nodes[nodeId] = newNode;
    }

    private applyTransforms(node: INode<T>, source: INode<T>) {
        const transformIds = this.getNodeTransforms(<string>node.id);

        if (transformIds.length === 0) return node;

        let oldNode = this.nodes[<string>node.id];

        return transformIds.reduce((newNode, transformId) => {
            const transform = this.transforms[<string>transformId];

            if (!transform) return;

            const resultNode = transform(newNode, oldNode, source, this);

            oldNode = newNode;

            return resultNode;
        }, node);
    }

    // -----------------------------------------------------------------------
    // Node Connections
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
    // Transform Connections
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

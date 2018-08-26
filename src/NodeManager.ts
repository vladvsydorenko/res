import { RelationManager } from "./RelationManager";
import { TId, THash } from "./types";
import { WeakRelationManager } from "./WeakRelationManager";

export interface INode<T> {
    id: TId;
    value: T;
}

export type TTransform<T> = (
    newNode: INode<T>,
    oldNode: INode<T>,
    sourceNode: INode<T>,
    nodeManager: NodeManager<T>
) => T;

export class NodeManager<T> {

    private nodes: THash<INode<T>> = {};

    private nodeConnections = new RelationManager();
    private transformConnections = new WeakRelationManager<TTransform<T>>();

    // -----------------------------------------------------------------------
    // Nodes
    // -----------------------------------------------------------------------

    public setNode(node: INode<T>, source = node) {
        const newNode = this.applyTransforms(node, source);
        const targetNodeIds = this.nodeConnections.getTargets(node.id);

        this.nodes[<string>node.id] = newNode;

        targetNodeIds.forEach(targetNodeId => {
            this.setNode({
                id: targetNodeId,
                value: newNode.value,
            }, node);
        });
    }

    private applyTransforms(node: INode<T>, source: INode<T>) {
        const transforms = this.getNodeTransforms(<string>node.id);

        if (transforms.length === 0) return node;

        let oldNode = this.nodes[<string>node.id];

        return transforms.reduce((newNode, transform) => {
            if (!transform) return;

            const resultNode = {
                id: node.id,
                value: transform(newNode, oldNode, source, this),
            };

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

    public setNodeTransforms(nodeId: TId, transforms: TTransform<T>[]) {
        this.transformConnections.setSources(nodeId, transforms);
    }

    public setTransformNodes(transformId: TTransform<T>, nodeIds: TId[]) {
        this.transformConnections.setTargets(transformId, nodeIds);
    }

    public getNodeTransforms(nodeId: TId) {
        return this.transformConnections.getSources(nodeId);
    }

    public getTransformNodes(transformId: TTransform<T>) {
        return this.transformConnections.getTargets(transformId);
    }

}

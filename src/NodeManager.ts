import { RelationManager } from "./RelationManager";
import { TId, THash } from "./types";
import { WeakRelationManager } from "./WeakRelationManager";
import { EventEmitter } from "./EventEmitter";

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

export interface INodeManagerBulkOptions<T> {
    setNode?: (INode<T> | [INode<T>, INode<T>])[];
    setNodeTargets?: [TId, TId[]];
    setNodeSources?: [TId, TId[]];
    setNodeTransforms?: [TId, TTransform<T>[]];
    setTransformNodes?: [TTransform<T>, TId[]];
    bulk?: INodeManagerBulkOptions<T>[];
}

export class NodeManager<T> {

    private nodes: THash<INode<T>> = {};

    private nodeConnections = new RelationManager();
    private transformConnections = new WeakRelationManager<TTransform<T>>();

    private eventEmitter = new EventEmitter();

    private isReactiveEnabled = true;

    // -----------------------------------------------------------------------
    // Nodes
    // -----------------------------------------------------------------------

    public setNode(node: INode<T>, source = node) {
        const newNode = this.applyTransforms(node, source);
        const targetNodeIds = this.nodeConnections.getTargets(node.id);

        this.nodes[<string>node.id] = newNode;

        this.eventEmitter.emit("set", [newNode, source]);

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
        targetNodeIds.forEach(nodeId => this.recalculateNode(nodeId));
    }

    public getNodeTargets(nodeId: TId) {
        return this.nodeConnections.getTargets(nodeId);
    }

    public setNodeSources(nodeId: TId, sourceNodeIds: TId[]) {
        this.nodeConnections.setSources(nodeId, sourceNodeIds);
        this.recalculateNode(nodeId);
    }

    public getNodeSources(nodeId: TId) {
        return this.nodeConnections.getSources(nodeId);
    }

    // -----------------------------------------------------------------------
    // Transform Connections
    // -----------------------------------------------------------------------

    public setNodeTransforms(nodeId: TId, transforms: TTransform<T>[]) {
        this.transformConnections.setSources(nodeId, transforms);
        this.recalculateNode(nodeId);
    }

    public getNodeTransforms(nodeId: TId) {
        return this.transformConnections.getSources(nodeId);
    }

    public setTransformNodes(transformId: TTransform<T>, nodeIds: TId[]) {
        this.transformConnections.setTargets(transformId, nodeIds);
        nodeIds.forEach(nodeId => this.recalculateNode(nodeId));
    }

    public getTransformNodes(transformId: TTransform<T>) {
        return this.transformConnections.getTargets(transformId);
    }

    public bulk(options: INodeManagerBulkOptions<T>) {
        if (options.setNode) {
            options.setNode.forEach(data => {

            });
        }
    }

    public recalculateNode(nodeId: TId) {
        if (!this.isReactiveEnabled) return;

        const node = this.nodes[<string>nodeId];
        if (!node) return;

        const sources = this.getNodeSources(nodeId);

        if (sources.length === 0) {
            this.setNode(node);
            return;
        }

        sources.forEach(sourceId => {
            this.setNode(node, this.nodes[<string>sourceId]);
        });
    }

    public recalculateAllNodes() {
        Object
            .keys(this.nodes)
            .forEach(nodeId => {
                const sources = this.getNodeSources(nodeId);
                // we want update only top-level (having no sources) nodes
                if (sources.length === 0) this.setNode(this.nodes[nodeId])
            });
    }

}

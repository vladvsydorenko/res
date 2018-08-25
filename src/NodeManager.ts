import { THash, TId, insertInHashOfArrays } from "./helpers";
interface INode<T> {
    id: TId;
    value: T;
}

type TTransform<T> = (newNode: INode<T>, oldNode: INode<T>, sourceNode: INode<T>, manager: NodeManager<T>) => INode<T>;

export class NodeManager<T> {

    // all set nodes
    private nodes: THash<INode<T>> = {};

    // all set transforms
    private transforms: THash<TTransform<T>> = {};

    // applied to connections transforms, targetNodeId => transformId[]
    private nodeToTransforms: THash<TId[]> = {};

    // source => targets
    private sourceToTargetsConnections: THash<TId[]> = {};

    // target => sources
    private targetToSourcesConnections: THash<TId[]> = {};

    // transformId => targetNodeId
    private transformToNodes: THash<TId[]> = {};

    public setNode(node: INode<T>, source: INode<T> = node) {
        const transforms = this.nodeToTransforms[<string>node.id];
        const oldNode = this.nodes[<string>node.id] || node;

        const newNode = transforms ? this.applyTransforms(node, oldNode, source, transforms) : node;
        this.nodes[<string>newNode.id] = newNode;

        const targetNodeIds = this.sourceToTargetsConnections[<string>newNode.id];
        if (!targetNodeIds) return;

        targetNodeIds.forEach(targetNodeId => {
            this.setNode({
                id: targetNodeId,
                value: newNode.value,
            }, newNode);
        });
    }

    public setNodeConnection(sourceNodeId: TId, targetNodeId: TId) {
        insertInHashOfArrays(targetNodeId, sourceNodeId, this.sourceToTargetsConnections);
        insertInHashOfArrays(sourceNodeId, targetNodeId, this.targetToSourcesConnections);

        const sourceNode = this.nodes[<string>sourceNodeId];

        if (!sourceNode) return;

        this.setNode({
            id: targetNodeId,
            value: sourceNode.value,
        });
    }

    public setNodeTransforms(nodeId: TId, transformIds: TId[]) {
        this.nodeToTransforms[<string>nodeId] = transformIds;
        const node = this.nodes[<string>nodeId];

        transformIds.forEach(transformId => insertInHashOfArrays(nodeId, transformId, this.transformToNodes));

        if (!node) return;
        this.setNode(node);
    }

    public addTransform(transformId: TId, transform: TTransform<T>) {
        this.transforms[<string>transformId] = transform;
        const targetNodeIds = this.transformToNodes[<string>transformId];

        if (!targetNodeIds) return;

        targetNodeIds.forEach(targetNodeId => {
            const node = this.nodes[<string>targetNodeId];

            if (!node) return;

            this.setNode(node);
        });
    }

    private applyTransforms(node: INode<T>, oldNode: INode<T>, source: INode<T>, transformIds: TId[]) {
        let old = oldNode;
        return transformIds.reduce((current, transformId) => {
            const transform = this.transforms[<string>transformId];

            if (!transform) return current;

            old = transform(current, old, source, this);

            return old;
        }, node);
    }
}

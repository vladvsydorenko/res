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

    // source => targets
    private sourceToTargetsConnections: THash<TId[]> = {};

    // target => sources
    private targetToSourcesConnections: THash<TId[]> = {};

    // applied to connections transforms, targetNodeId => transformId
    private appliedTransforms: THash<TId> = {};

    public setNode(node: INode<T>, source: INode<T> = node) {
        const transformId = this.appliedTransforms[<string>node.id];
        const transform = this.transforms[<string>transformId];
        const oldNode = this.nodes[<string>node.id] || node;

        const newNode = transform ? transform(node, oldNode, source, this) : node;
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

    public setTransform(transformId: TId, transform: TTransform<T>) {
        this.transforms[<string>transformId] = transform;
    }

    public applyTransform(transformId: TId, nodeId: TId) {
        this.appliedTransforms[<string>nodeId] = transformId;
    }

}

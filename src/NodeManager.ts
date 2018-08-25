export type TNodeSetter<T> = (
    newNode: Readonly<INode<T>>,
    oldNode: Readonly<INode<T>>,
    parentNode: Readonly<INode<T>> | null,
    manager: Readonly<NodeManager<T>>
) => INode<T>;

export interface INode<T> {
    readonly id: string | symbol;
    readonly value: T;
}

export class NodeManager<T = any[]> {

    private nodes: { [nodeId: string]: INode<T> } = {};
    private transforms: { [nodeId: string]: TNodeSetter<T> } = {};
    private connections: { [nodeId: string]: (string | symbol)[] } = {};

    public setNode(node: INode<T>, parent?: INode<T>): INode<T> {
        const nodeId = <string>node.id;
        const oldNode = this.nodes[nodeId];

        const transform = this.transforms[nodeId];
        const resultNode = transform ? transform(node, oldNode, parent, this) : node;
        this.nodes[nodeId] = resultNode;

        this.updateConnectedNodes(resultNode);

        return resultNode;
    }

    public getNode(nodeId: string | symbol) {
        return this.nodes[<string>nodeId];
    }

    public setTransform(nodeId: string | symbol, setter: TNodeSetter<T>) {
        this.transforms[<string>nodeId] = setter;
    }

    public setConnection(parentNodeId: string | symbol, childNodeId: string | symbol) {
        const prevConnections = this.connections[<string>parentNodeId] || [];

        if (prevConnections && prevConnections.indexOf(childNodeId) !== -1) return;

        this.connections[<string>parentNodeId] = [
            ...(prevConnections ? prevConnections : []),
            childNodeId,
        ];
    }

    private updateConnectedNodes(node: INode<T>) {
        const nodeConnections = this.connections[<string>node.id];

        console.log('update children?', node.id);

        if (!nodeConnections) return;

        nodeConnections.forEach(nodeId => this.setNode({
            id: nodeId,
            value: node.value,
        }, node));

    }
}
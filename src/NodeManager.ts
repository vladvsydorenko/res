export type TNodeSetter = (
    value: ReadonlyArray<any>,
    node: Readonly<INode>,
    parent: Readonly<INode> | null,
    nm: NodeManager
) => INode;

export interface INode {
    id: string | Symbol;
    value: any;
    setter: TNodeSetter;
}

export class NodeManager {

    private nodes: {
        [streamId: string]: INode;
    } = {};

    private connections: {
        // source id -> target ids
        [sourceStreamId: string]: (string | Symbol)[];
    } = {};

    public createNode(nodeId: string | Symbol, setter: TNodeSetter = NodeManager.defaultNodeSetter, value: any[] = []) {
        this.nodes[<string>nodeId] = {
            id: nodeId,
            value,
            setter,
        };
    }

    public setValue(nodeId: string | Symbol, value: any[], parent?: Readonly<INode>) {
        const node = this.nodes[<string>nodeId];
        if (!node) return;

        const currentValue = node.value;
        const resultNode = node.setter(value, node, parent, this);

        this.nodes[<string>nodeId] = resultNode;

        // if nothing was changed
        if (resultNode.value === currentValue) return;

        const connections = this.connections[<string>nodeId];
        if (!connections) return;

        connections.forEach((nodeId) => {
            // console.log("result node", resultNode);
            this.setValue(nodeId, resultNode.value, resultNode);
        });
    }

    public getValue(nodeId: string): ReadonlyArray<any> {
        const node = this.nodes[nodeId];

        if (node) return node.value;
        return [];
    }

    public connectNodes(parentNodeId: string | Symbol, childNodeId: string | Symbol) {
        if (
            this.isConnected(parentNodeId, childNodeId) ||
            parentNodeId === childNodeId
        ) return;

        this.connections[<string>parentNodeId] = [
            ...(this.connections[parentNodeId as string] || []),
            childNodeId
        ];
    }

    public disconnectNodes(parentNodeId: string | Symbol, childNodeId: string | Symbol) {
        const connections = this.connections[<string>parentNodeId];
        if (!connections) return;

        const index = connections.indexOf(childNodeId);
        if (index === -1) return;

        this.connections[<string>parentNodeId] = [
            ...connections.slice(0, index),
            ...connections.slice(index + 1),
        ];
    }

    public isConnected(parentNodeId: string | Symbol, childNodeId: string | Symbol): boolean {
        const connections = this.connections[<string>parentNodeId];
        if (!connections) return false;

        return connections.indexOf(parentNodeId) > -1;
    }

    static defaultNodeSetter(value: ReadonlyArray<any>, node: Readonly<INode>) {
        return {
            ...node,
            value,
        };
    }

}


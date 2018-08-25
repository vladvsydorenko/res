import { EventEmitter, TListenerFn } from "./EventEmitter";

export type TNodeSetter = (
    value: ReadonlyArray<any>,
    node: Readonly<INode>,
    parentNode: Readonly<INode> | null,
    nm: NodeManager
) => INode;

export interface INode {
    id: string | Symbol;
    value: any;
    setter: TNodeSetter;
}

export enum ENodeManagerEventTypes {
    valueSet = "valueSet",
    nodesConnected = "nodesConnected",
    nodesDisconnected = "nodesDisconnected",
}

export class NodeManager {

    private nodes: { [streamId: string]: INode; } = {};

    private connections: { [sourceStreamId: string]: (string | Symbol)[]; } = {};

    private eventEmitter = new EventEmitter();

    public createNode(nodeId: string | Symbol, setter: TNodeSetter = NodeManager.defaultNodeSetter, value: any[] = []) {
        this.nodes[<string>nodeId] = {
            id: nodeId,
            value,
            setter,
        };
    }

    public setValue(nodeId: string | Symbol, value: any[], parentNode?: Readonly<INode>) {
        const node = this.nodes[<string>nodeId];
        if (!node) return;

        const currentValue = node.value;
        const resultNode = node.setter(value, node, parentNode, this);

        this.nodes[<string>nodeId] = resultNode;

        // if nothing was changed
        if (resultNode.value === currentValue) return;

        this.eventEmitter.emit(ENodeManagerEventTypes.valueSet, [value, node, parentNode, this]);

        const connections = this.connections[<string>nodeId];
        if (!connections) return;

        connections.forEach((nodeId) => {
            this.setValue(nodeId, resultNode.value, resultNode);
        });
    }

    public getValue(nodeId: string | Symbol): ReadonlyArray<any> {
        const node = this.nodes[<string>nodeId];

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

        this.eventEmitter.emit(ENodeManagerEventTypes.nodesConnected, [parentNodeId, childNodeId, this]);
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

        this.eventEmitter.emit(ENodeManagerEventTypes.nodesDisconnected, [parentNodeId, childNodeId, this]);
    }

    public getConnectedNodes(nodeId: string | Symbol): (string | Symbol)[] {
        return this.connections[<string>nodeId] || [];
    }

    public isConnected(parentNodeId: string | Symbol, childNodeId: string | Symbol): boolean {
        const connections = this.connections[<string>parentNodeId];
        if (!connections) return false;

        return connections.indexOf(parentNodeId) > -1;
    }

    public on(eventType: ENodeManagerEventTypes, listener: TListenerFn, thisArg?: any): Symbol {
        return this.eventEmitter.on(eventType, listener, thisArg);
    }

    public off(listenerId: Symbol) {
        return this.eventEmitter.off(listenerId);
    }

    static defaultNodeSetter(value: ReadonlyArray<any>, node: Readonly<INode>) {
        return {
            ...node,
            value,
        };
    }

}


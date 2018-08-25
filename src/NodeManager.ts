import { EventEmitter, TListenerFn } from "./EventEmitter";

export type TTransfrom<T> = (
    newNode: Readonly<INode<T>>,
    oldNode: Readonly<INode<T>> | undefined,
    parentNode: Readonly<INode<T>> | undefined,
    manager: Readonly<NodeManager<T>>
) => INode<T>;

export interface INode<T> {
    readonly id: TNodeId;
    readonly value: T;
}

export enum ENodeManagerEvents {
    set = "set",
}

export type TNodeId = string | symbol;

export class NodeManager<T = any[]> {

    private nodes: { [nodeId: string]: INode<T> } = {};
    private transforms: { [nodeId: string]: TTransfrom<T> } = {};
    private sourceToTargetConnections: { [nodeId: string]: TNodeId[] } = {};
    private targetToSourceConnections: { [nodeId: string]: TNodeId[] } = {};

    private eventEmitter = new EventEmitter();

    // --- nodes

    public setNode(node: INode<T>, parent?: INode<T>): INode<T> {
        const nodeId = <string>node.id;
        const oldNode = this.nodes[nodeId];

        const transform = this.transforms[nodeId];
        const resultNode = transform ? transform(node, oldNode, parent, this) : node;
        this.nodes[nodeId] = resultNode;

        this.eventEmitter.emit(ENodeManagerEvents.set, [node, parent, this]);

        this.updateConnectedNodes(resultNode);

        return resultNode;
    }

    public setManyNodes(nodes: INode<T>[]) {
        nodes.forEach(node => this.setNode(node));
    }

    public getNode(nodeId: TNodeId): Readonly<INode<T>> {
        return this.nodes[<string>nodeId];
    }

    // --- transform

    public setTransform(nodeId: TNodeId, setter: TTransfrom<T>) {
        this.transforms[<string>nodeId] = setter;
    }

    // --- connections

    public connectNodes(sourceNodeId: TNodeId, targetNodeId: TNodeId) {
        const prevTargets = this.sourceToTargetConnections[<string>sourceNodeId] || [];
        const prevSources = this.targetToSourceConnections[<string>targetNodeId] || [];

        if (prevTargets && prevTargets.indexOf(targetNodeId) !== -1) return;

        this.sourceToTargetConnections[<string>sourceNodeId] = [
            ...(prevTargets ? prevTargets : []),
            targetNodeId,
        ];

        this.targetToSourceConnections[<string>targetNodeId] = [
            ...(prevSources ? prevSources : []),
            sourceNodeId,
        ];
    }

    public connectManyNodes(nodeIds: TNodeId[]) {
        nodeIds.forEach((childId, index) => {
            // there is no parent for 0 elemtn
            if (index === 0) return;

            const parentId = nodeIds[index - 1];
            this.connectNodes(parentId, childId);
        });
    }

    public getSourceNodeIds(targetNodeId: TNodeId): ReadonlyArray<TNodeId> {
        return this.targetToSourceConnections[<string>targetNodeId] || [];
    }

    public getSourceNodes(targetNodeId: TNodeId): ReadonlyArray<INode<T>> {
        return this.getSourceNodeIds(targetNodeId).map(sourceId => this.nodes[<string>sourceId]);
    }

    public getTargetNodeIds(sourceNodeId: TNodeId): ReadonlyArray<TNodeId> {
        return this.sourceToTargetConnections[<string>sourceNodeId] || [];
    }

    public getTargetNodes(sourceNodeId: TNodeId): ReadonlyArray<INode<T>> {
        return this.getTargetNodeIds(sourceNodeId).map(targetNodeId => this.nodes[<string>targetNodeId]);
    }

    // --- events

    public on(eventId: ENodeManagerEvents, listener: TListenerFn, thisArg?: any) {
        return this.eventEmitter.on(eventId, listener, thisArg);
    }

    public off(listenerId: symbol) {
        this.eventEmitter.off(listenerId);
    }

    // --- helpers

    private updateConnectedNodes(node: INode<T>) {
        const nodeConnections = this.sourceToTargetConnections[<string>node.id];

        if (!nodeConnections) return;

        nodeConnections.forEach(nodeId => this.setNode({
            id: nodeId,
            value: node.value,
        }, node));

    }
}
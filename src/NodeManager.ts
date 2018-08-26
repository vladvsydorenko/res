import { THash, TId } from "./helpers";

interface INodeManagerBulkAction {
    setNodes?: any[];

    setNodeTransforms?: any[];
    insertNodeTransforms?: any[];
    registerNodeTransforms?: any[];

    setConnections?: any[];
    insertConnections?: any[];
}

export class NodeManager {

    private nodes: THash<any> = {};
    private connections: THash<any> = {};
    private transforms: THash<any> = {};

    private topNodes: TId[]
    private sourceToTargets: THash<TId[]> = {};
    private targetToSources: THash<TId[]> = {};
    private nodeToTransforms: THash<TId[]> = {};

    public setNode(...args: any[]) {}
    public getNode(...args: any[]) {}

    public setNodeTransforms(...args: any[]) {}
    public insertNodeTransforms(...args: any[]) {}
    public registerNodeTransforms(...args: any[]) {}

    public setConnections(...args: any[]) {}
    public insertConnections(...args: any[]) {}

    public bulk(action: INodeManagerBulkAction) {}

    // recalculate everything
    public recalculate() {}
}
type TRNodeId = string | symbol;

type TRNodeSetter<T> = () => IRNode<T>;

interface IRNode<T> {
    id: TRNodeId;
    value: T;
    setter: TRNodeSetter<T>;
}

class RNodeManager<T = any[]> {

    private sortedNodes: { [nodeId: string]: IRNode<T> } = {};

    public addNode(nodeId: string, setter: TRNodeSetter<T>, initialValue: T) {
        this.sortedNodes[<string>nodeId] = {
            id: nodeId,
            value: initialValue,
            setter,
        };
    }

    public setValue(nodeId: string, value: T) {
        const node = this.sortedNodes[nodeId];

        if (!node) return;


    }

    public getValue() {}

}
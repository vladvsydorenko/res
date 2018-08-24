import { NodeManager, INode, TNodeSetter } from "./NodeManager";

const nm = new NodeManager();

const merge = (): TNodeSetter => {
    const values: { [parentId: string]: ReadonlyArray<any> } = {};

    return (value, node, parent) => {
        if (!parent) return node;

        values[<string>parent.id] = value;

        const mergedValues = Object
            .keys(values)
            .reduce<ReadonlyArray<any>>((acc, parentId) => {
                return [
                    ...acc,
                    ...values[parentId],
                ];
            }, []);

        return {
            ...node,
            value: mergedValues,
        };
    };
};

const removeDuplicates: TNodeSetter = (value, node, parent) => {
    return {
        ...node,
        value: value.reduce<ReadonlyArray<any>>((acc, v) => {
            return acc.indexOf(v) === -1 ? [...acc, v] : acc;
        }, [])
    };
};

const combineSetters = (setters: TNodeSetter[]): TNodeSetter => {
    return (value, node, parent, nm) => {
        let resultNode;

        setters.some(setter => {
            resultNode = setter(value, node, parent, nm);

            return !resultNode.value.length;
        });

        return resultNode || node;
    };
}

nm.createNode("numbers", (value, node) => {
    return {
        ...node,
        value,
    };
});

nm.createNode("evenNumbers", (value, node) => {
    return {
        ...node,
        value: value.filter(v => v % 2 === 0),
    };
});

nm.createNode("backAllNumbers", combineSetters([
    merge(),
    removeDuplicates,
]));

nm.connectNodes("numbers", "evenNumbers");
nm.connectNodes("numbers", "backAllNumbers");
nm.connectNodes("evenNumbers", "backAllNumbers");

nm.setValue("numbers", [1, 2, 3]);

(<any>window).nm = nm;
console.log(nm.getValue("backAllNumbers"));

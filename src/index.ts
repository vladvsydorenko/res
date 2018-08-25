import { NodeManager } from "./NodeManager";

const nm = new NodeManager<any[]>();

nm.setNode({
    id: "numbers",
    value: [1, 2, 3],
});

nm.setNodeConnection("numbers", "even");
nm.setNodeConnection("numbers", "odd");

nm.setNodeTransforms("even", ["even"]);
nm.setNodeTransforms("odd", ["odd"]);

nm.addTransform("even", (node) => {
    return {
        id: node.id,
        value: node.value.filter(v => v % 2),
    };
});

nm.addTransform("odd", (node) => {
    return {
        id: node.id,
        value: node.value.filter(v => v % 2 === 0),
    };
});

console.log(nm);

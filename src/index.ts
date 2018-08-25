import { NodeManager, ENodeManagerEvents } from "./NodeManager";

const nm = new NodeManager<number[]>();

nm.connectNodes("entities", "evenNumbers");
nm.connectNodes("entities", "greaterThen10");
nm.connectManyNodes(["entities", "evenNumbers", "greaterThen10"]);

nm.setTransform("evenNumbers", node => {
    return {
        id: node.id,
        value: node.value.filter(v => v % 2),
    };
});

nm.setTransform("greaterThen10", node => {
    return {
        id: node.id,
        value: node.value.filter(v => v > 10),
    };
});

nm.on(ENodeManagerEvents.set, (node, parent, nm) => {
    // console.log("set", node, parent, nm);
});

nm.setManyNodes([{
    id: "entities",
    value: [1, 2, 3, 20],
}]);

console.log(nm.getTargetNodes("entities"));

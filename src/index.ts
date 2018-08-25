import { NodeManager } from "./NodeManager";

const nm = new NodeManager<number[]>();

// nm.setNode({
//     id: "evenNumbers",
//     value: []
// });

nm.setConnection("entities", "evenNumber");

nm.setNode({
    id: "entities",
    value: [1, 2, 3],
});

console.log(nm);

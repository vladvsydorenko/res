import { NodeManager } from "./NodeManager";

const nm = new NodeManager<any[]>();

nm.setNodeConnection("entities", "users");

nm.setNode({
    id: "entities",
    value: [1, 2, 3],
});

console.log(nm);

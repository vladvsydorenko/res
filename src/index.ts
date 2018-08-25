import { NodeManager } from "./NodeManager";

const nm = new NodeManager<any[]>();

nm.setNode({
    id: "entities",
    value: [1, 2, 3],
});

nm.setNodeConnection("entities", "users");

console.log(nm);

import { NodeManager } from "./NodeManager";

const nm = new NodeManager<number[]>();

// nm.setNodeTargets("users", ["admins", "moderators", "superAdmins", "simple"]);
// nm.setNodeTargets("admins", ["superAdmins", "justAdmins"]);

// nm.setNode({ id: "entities", value: [1, 2, 3] });

nm.setNodeTransforms("test", [
    (node) => node.value.filter(v => v % 2 === 0),
    (node) => node.value.filter(v => v > 10),
]);
nm.setNodeTransforms("users", [
    (node) => node.value.map(v => v * 6),
]);
nm.setNodeTargets("test", ["users"]);

nm.setNode({
    id: "test",
    value: [1, 2, 3, 4, 5, 11, 12]
});

debugger;

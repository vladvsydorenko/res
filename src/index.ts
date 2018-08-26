import { NodeManager } from "./NodeManager";

const nm = new NodeManager();

nm.setNode({ id: "entities", value: [] });

// set exactly what is passed
nm.setConnections("entities", ["users", "number", "others"]);
// insert into already set if any
nm.insertConnections("entities", ["admins"]);

nm.setNodeTransforms("users", ["users"]);
nm.insertNodeTransforms("users", ["users"]);
nm.registerNodeTransforms("users", () => {});

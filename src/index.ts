import { NodeManager } from "./NodeManager";

const nm = new NodeManager<number | string>();

nm.setNodeTargets("users", ["admins", "moderators", "superAdmins", "simple"]);
nm.setNodeTargets("admins", ["superAdmins", "justAdmins"]);

// nm.setNode({ id: "entities", value: [1, 2, 3] });

debugger;

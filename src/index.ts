import { NodeManager } from "./NodeManager";

const nm = new NodeManager();

nm.setNodeTargets("users", ["admins", "moderators", "superAdmins", "simple"]);
nm.setNodeTargets("admins", ["superAdmins", "justAdmins"]);

nm.setTransformNodes("filterAdmins", ["admin"]);

console.log(nm.getTransformNodes("filterAdmins"));

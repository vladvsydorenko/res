import { NodeManager } from "./NodeManager";

const nm = new NodeManager();

nm.setNodeTargets("users", ["admins", "moderators", "simple"]);
nm.setNodeTargets("admins", ["superAdmins", "justAdmins"]);

debugger;

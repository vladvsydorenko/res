import { EntityManager } from "../Entity/EntityManager";

export interface ISystem {
    update: (manager: EntityManager) => void;
}

export class SystemManager {

    private systems = new Map<Function, ISystem>();
    private entityManager: EntityManager;

    public addSystem(system: ISystem) {
        this.systems.set(system.constructor, system);
    }

    public removeSystem(SystemType: Function) {
        this.systems.delete(SystemType);
    }

    // run a single system, execute its jobs
    public runSystem(SystemType: Function) {
        const system = this.systems.get(SystemType);
        if (!system) return;

        system.update(this.entityManager);
    }

}

import { EntityManager, IEntity } from "./Entity/EntityManager";

const em = new EntityManager();

class Point {
    x = 0;
    y = 0;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

const entity: IEntity = {
    id: Symbol(),
    version: 0,
    name: "Entity 1",
};

const entity2: IEntity = {
    id: Symbol(),
    version: 0,
    name: "Entity 2",
};

em.setComponent(entity2, new Point(60, 40));
em.setComponent(entity, new Point(10, 20));
em.setComponent(entity, new Point(10, 20));
em.setComponent(entity, new Point(10, 20));

em.unsetComponent(entity, Point);

console.log(em.hasComponent(entity, Point));
console.log(em.getEntitiesByType(Point));

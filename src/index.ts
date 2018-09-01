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

class Vector {
    x = 0;
    y = 0;
    z = 0;

    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
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
em.setComponent(entity, new Vector(10, 20, 30));
em.setComponent(entity, new Point(10, 20));

// em.unsetComponent(entity, Point);

console.log("hasComponent", em.hasComponent(entity, Point));
console.log("getEntitiesByType", em.getEntitiesByType(Point));
console.log("getComponentsByEntity", em.getComponentsByEntity(entity));
console.log("getComponentsByType", em.getComponentsByType(Point));
console.log("getComponent", em.getComponent(entity2, Point));

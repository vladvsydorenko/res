import { EntityManager, IEntity } from "./Entity/EntityManager";

const em = new EntityManager();

class Point {
    x: number;
    y: number;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

class Name {
    firstname: string;
    secondname: string;

    constructor(firstname = "", secondname = "") {
        this.firstname = firstname;
        this.secondname = secondname;
    }
}

const entity1: IEntity = { id: Symbol(), version: 0 };
const entity2: IEntity = { id: Symbol(), version: 0 };

(test as any)("test", () => {

    em.setComponent(entity1, new Point(2, 4));
    expect(em.getComponent(entity1, Point)).toEqual({ x: 2, y: 4 });
    expect(em.getComponent(entity2, Point)).toEqual(undefined);

    em.setComponent(entity2, new Point(4, 2));
    expect(em.getComponent(entity1, Point)).toEqual({ x: 2, y: 4 });
    expect(em.getComponent(entity2, Point)).toEqual({ x: 4, y: 2 });

    em.setComponent(entity2, new Name("John", "Petrenko"));
    expect(em.getComponent(entity2, Name)).toEqual({ firstname: "John", secondname: "Petrenko" });

    expect(em.hasComponent(entity1, Name)).toBe(false);

    expect(em.getComponentsByEntity(entity1)).toEqual([{ x: 2, y: 4 }]);
    expect(em.getComponentsByEntity(entity2)).toEqual([{ x: 4, y: 2 }, { firstname: "John", secondname: "Petrenko" }]);

    expect(em.getComponentsByType(Point)).toEqual([{ x: 2, y: 4 }, { x: 4, y: 2 }]);
    expect(em.getComponentsByType(Name)).toEqual([{ firstname: "John", secondname: "Petrenko" }]);

    expect(em.getEntitiesByType(Point)).toEqual([entity1, entity2]);
    expect(em.getEntitiesByType(Name)).toEqual([entity2]);

    em.unsetComponent(entity2, Name);
    expect(em.getComponent(entity2, Name)).toBe(undefined);
    expect(em.getComponentsByType(Name)).toEqual([]);
    expect(em.getEntitiesByType(Name)).toEqual([]);
    expect(em.getComponentsByEntity(entity2)).toEqual([{ x: 4, y: 2 }]);

});


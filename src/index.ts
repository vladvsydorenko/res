import { EntityManager } from "./ecs/Entity/EntityManager";

const em = new EntityManager();

const entity1 = em.createEntity();

em.setComponent(entity1, new Number(10));
em.setComponent(entity1, new String("Test"));
debugger;

    byType
        InputComponent      [1]
        UserComponent       [1, 2]
        RequestComponent    [1, 2]

    byEntity
        1                   [InputComponent, UserComponent, RequestComponent]
        2                   [UserComponent, RequestComponent]
        3                   []

    groupsByType
        InputComponent      [Group 1]
        UserComponent       [Group 1, Group 2]
        RequestComponent    [Group 1, Group 2]

    Group 1
    {
        Entity              [1]
        InputComponent      [1] \
        UserComponent       [1]  |- entity { id: 1, components: [InputComponent, UserComponent, RequestComponent] }
        RequestComponent    [1] /
    }

    Group 2
    {
        Entity              [1, 2]
        UserComponent       [1, 2] \- entity { id: 1, components: [InputComponent, UserComponent, RequestComponent] }
        RequestComponent    [1, 2] /- entity { id: 2, components: [UserComponent, RequestComponent] }
    }

--- Groups
```ts
if (group.hasEntity(entity)) group.replaceComponent(entity, InputComponent, inputComponent);

components = byEntity.get(entity);
if (group.validate(components)) group.push(entity, components);
```







































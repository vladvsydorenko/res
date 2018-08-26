# Reactive Node Manager

Few notes:

- Store Top-level Nodes (having no sources)
    - it gives a possibility to fully update all graph at any time, just re-set actuall Top-level nodes' values again and it will flow to targets automatically
- Add bulk changes
    - It's needed to set many nodes/connections/transforms etc at a time avoiding re-calculating on each move
- Update nodes if:
    - `setNode` having targets
    - `setNodeTransforms`, if node was added already
    - `registerNodeTransforms`, if `nodeToTransforms` has transform id
    - `setConnections`
- Bulk
    - Bulk action `shouldn't` be reactive while setting. Then recalculate all

How to connect nodes
1. Set a connection between two nodes
2. Add a transform function
3. Connect a target node and a transform if needed
4. Set a source node in connection

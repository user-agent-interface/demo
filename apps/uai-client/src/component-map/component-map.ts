import { component, Component, ComponentAsTool } from "./component.util"
import { z } from "zod";

// Replace ToolSet (from "ai") with ComponentSet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComponentSet = Record<string, ComponentAsTool<any, any>>;

export class ComponentMap {
    constructor(map: (component: Component, schema: typeof z) => ComponentSet) {
        return map(component, z);
    }
}
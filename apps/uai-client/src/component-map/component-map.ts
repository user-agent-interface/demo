import { component, Component, ComponentAsTool } from './component.util';
import { z } from 'zod';

// Replace ToolSet (from "ai") with ComponentSet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComponentSet = Record<string, ComponentAsTool<any, any>>;

export const defineComponentMap = (
  map: (component: Component, schema: typeof z) => ComponentSet
) => map(component, z);

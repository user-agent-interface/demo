import { Tool } from 'ai';
import { component, Component, ComponentAsTool } from './component.util';
import { z } from 'zod';

// Replace ToolSet (from "ai") with ComponentSet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentSet = Record<string, ComponentAsTool<any, any>>;

export type ComponentSetForServer = Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Tool<any, any>
>;

export const defineComponentMap = (
  map: (component: Component, schema: typeof z) => ComponentSet
) => map(component, z);

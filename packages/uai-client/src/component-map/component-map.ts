import { component as componentUtil, ComponentAsTool } from './component.util';
import { z } from 'zod';

// Replace ToolSet (from "ai") with ComponentMap
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentMap = Record<string, ComponentAsTool<any, any>>;

export const defineComponentMap = <COMPONENT_MAP extends ComponentMap>(
  map: (component: typeof componentUtil, schema: typeof z) => COMPONENT_MAP
) => map(componentUtil, z);

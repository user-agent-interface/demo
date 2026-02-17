import { ComponentAsTool } from './component.util';

// Replace ToolSet (from "ai") with ComponentMap
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentMap = Record<string, ComponentAsTool<any, any>>;

// <COMPONENT_MAP extends ComponentMap> is inferring any type instead of undefined
// for the not defined INPUT and OUTPUT types of the ComponentAsTool.
// We keep COMPONENT_MAP as free type to be able to correctly infer the type of the components.
export const defineComponentMap = <COMPONENT_MAP>(map: COMPONENT_MAP) => map;

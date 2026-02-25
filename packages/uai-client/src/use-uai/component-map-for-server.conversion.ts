import { ComponentMapForServer } from '@uai/shared';
import { ComponentMap } from '../component-map/component-map';
import { zodSchema } from 'ai';

export const convertComponentMapForServer = async (
  componentMap: ComponentMap
) => {
  const componentMapForServer: ComponentMapForServer = {};

  // convert the tool definition to an interpretable format for the UAI server (e.g. JSON schemas)
  for (const [componentKey, component] of Object.entries(componentMap)) {
    const inputSchema = await zodSchema(component.inputSchema).jsonSchema;
    const outputSchema = component.outputSchema
      ? await zodSchema(component.outputSchema).jsonSchema
      : undefined;

    componentMapForServer[componentKey] = {
      title: component.title,
      description: component.description,
      inputExamples: component.inputExamples,
      inputSchema,
      outputSchema,
    };
  }

  return componentMapForServer;
};

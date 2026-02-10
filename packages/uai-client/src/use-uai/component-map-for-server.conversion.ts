import { ComponentMapForServer } from '@uai/shared';
import { ComponentMap } from '../component-map/component-map';
import { asSchema } from 'ai';

export const convertComponentMapForServer = (componentMap: ComponentMap) => {
  const componentMapForServer: ComponentMapForServer = {};
  // convert the tool definition to an interpretable format for the UAI server (e.g. JSON schemas)
  Object.entries(componentMap).forEach(async ([componentKey, component]) => {
    componentMapForServer[componentKey] = {
      title: component.title,
      description: component.description,
      inputExamples: component.inputExamples,
      inputSchema: await asSchema(component.inputSchema).jsonSchema,
      outputSchema: component.outputSchema
        ? await asSchema(component.outputSchema).jsonSchema
        : undefined,
    };
  });

  return componentMapForServer;
};

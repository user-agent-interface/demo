import { ComponentMap } from '../component-map/component-map';
import {
  ReasoningUIPart,
  StepStartUIPart,
  TextUIPart,
  UIToolInvocation,
} from 'ai';
import { ComponentInputOf } from '../component-map/component.util';

/**
 * UI Messages. They are used in the client and to communicate between the UAI client and the UAI server.
 */
export type UAIMessage<COMPONENT_MAP extends ComponentMap> = {
  /**
   * A unique identifier for the message.
   */
  id: string;

  /**
   * The role of the message.
   */
  role: 'system' | 'user' | 'assistant';

  /**
   * The timestamp of the message.
   */
  timestamp: string;

  /**
   * The parts of the message.
   */
  parts: Array<
    | StepStartUIPart
    | ReasoningUIPart
    | TextUIPart
    | ComponentRenderUIPart<COMPONENT_MAP>
  >;
} &
  // Textual message
  (| {
        type: 'text';
        /**
         * Text content of the message.
         */
        text: TextUIPart;
      }

    // Component render message
    | {
        type: 'render-component';
        /**
         * The component to be rendered.
         */
        renderComponent: ComponentRenderUIPart<COMPONENT_MAP>;
      }

    // Empty message
    | { type: 'empty' }
  );
export type UAITextMessage<COMPONENT_MAP extends ComponentMap> =
  UAIMessage<COMPONENT_MAP> & { type: 'text' };
export type UAIRenderComponentMessage<COMPONENT_MAP extends ComponentMap> =
  UAIMessage<COMPONENT_MAP> & { type: 'render-component' };

export type ComponentRenderUIPart<
  COMPONENT_MAP extends ComponentMap,
  K extends keyof COMPONENT_MAP = keyof COMPONENT_MAP,
> = K extends keyof COMPONENT_MAP
  ? {
      type: 'render-component';
      componentId: K;

      // store the other parts of the toolCall to be able to replace
      _toolCall: Omit<UIToolInvocation<COMPONENT_MAP[K]>, 'input'>;
    } & COMPONENT_MAP[K] &
      (
        | {
            state: Extract<
              UIToolInvocation<COMPONENT_MAP[K]>['state'],
              'input-streaming'
            >;
            // input values are under streaming
            componentInput: Partial<ComponentInputOf<COMPONENT_MAP[K]>>;
          }
        | {
            state: Exclude<
              UIToolInvocation<COMPONENT_MAP[K]>['state'],
              'input-streaming'
            >;
            componentInput: ComponentInputOf<COMPONENT_MAP[K]>;
          }
      )
  : never;

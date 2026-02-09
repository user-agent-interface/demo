import { ComponentMap } from './component-map/component-map';
import {
  ReasoningUIPart,
  StepStartUIPart,
  TextUIPart,
  UIToolInvocation,
} from 'ai';
import { ComponentInputOf } from './component-map/component.util';

/**
 * UI Messages. They are used in the client and to communicate between the UAI client and the UAI server.
 */
export interface UAIMessage<COMPONENT_MAP extends ComponentMap> {
  /**
   *A unique identifier for the message.
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
   * The parts of the message. Use this for rendering the message in the UI.
   *
   * User messages can have text parts.
   *
   * Assistant messages can have text, reasoning, and component render invocations parts.
   */
  parts: Array<
    | StepStartUIPart
    | TextUIPart
    | ReasoningUIPart
    | ComponentRenderUIPart<COMPONENT_MAP[keyof COMPONENT_MAP]>
  >;
}

type ComponentRenderUIPart<COMPONENT extends ComponentMap[keyof ComponentMap]> =
  {
    type: 'render-component';
    componentId: string;
    state: UIToolInvocation<COMPONENT>['state'];
    inputValues: ComponentInputOf<COMPONENT>;
    _toolCall: Omit<
      UIToolInvocation<COMPONENT>,
      // store the other parts of the toolCall to be able to replace
      'input'
    >;
  } & COMPONENT;

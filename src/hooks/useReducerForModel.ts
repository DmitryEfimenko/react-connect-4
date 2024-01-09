import { useReducer } from "react";

/**
 * Type for setter function for a property.
 * Ex: given property T as "name", returns "setName"
 */
export type ActionSetterName<T> = `set${Capitalize<string & T>}`;

/**
 * Type for action type property.
 * Ex: given property T as "name", returns "SET_Name"
 */
export type ActionSetterType<T> = `SET_${Capitalize<string & T>}`;

/**
 * Signature for a function that dispatches a redux action
 */
export type ActionDispatchFn<T> = (payload: T) => void;

/**
 * Type for action creators.
 * Ex: given T as object `{ name: string, age: number }`, generates type:
 * ```ts
 * {
 *   setName: (payload: string) => { type: 'SET_Name'; payload: string; };
 *   setAge: (payload: number) => { type: 'SET_Age'; payload: number; };
 * }
 * ```
 */
export type ActionCreators<T> = {
  [K in keyof T as ActionSetterName<K>]: (payload: T[K]) => { type: ActionSetterType<K>; payload: T[K] };
};

/**
 * Type for object containing functions that dispatch actions
 * Ex: given T as object `{ name: string, age: number }`, generates type:
 * ```ts
 * {
 *   setName: (payload: string) => void;
 *   setAge: (payload: number) => void;
 * }
 * ```
 */
export type DispatchActions<T> = Record<keyof ActionCreators<T>, ActionDispatchFn<T[keyof T]>>;

/**
 * Type for an object containing all possible actions for a given model.
 * Ex: given T as object `{ name: string, age: number }`, generates type:
 * ```ts
 * {
 *   setName: { type: 'SET_Name'; payload: string; };
 *   setAge: { type: 'SET_Age'; payload: number; };
 * }
 * ```
 */
export type ActionTypes<T> = {
  [K in keyof T as ActionSetterName<K>]: { type: ActionSetterType<K>; payload: T[K] };
};

/**
 * Type for actions for a given model.
 * Ex: given T as object { name: string, age: number }, generates type:
 * ```ts
 *   { type: 'SET_Name'; payload: string; }
 * | { type: 'SET_Age'; payload: number; }
 * | { type: '_RESET' };
 * ```
 */
export type SetterAction<T> = ActionTypes<T>[keyof ActionTypes<T>] | { type: '_RESET' };

/**
 * @param model The key-value object representing state. Usually initialState is passed.
 * @returns all action creators for a given model.
 */
export function generateActionCreators<T extends Record<string, any>>(model: T) {
  const actions = {} as Record<string, any>;

  for (const key in model) {
    const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
    const type = `SET_${capitalizedKey}` as ActionSetterType<keyof T>;
    const actionName = `set${capitalizedKey}` as ActionSetterName<keyof T>

    actions[actionName] = (payload: T[keyof T]) => ({ type, payload });
  }

  return actions as ActionCreators<T>;
}

/**
 * Abstraction function on top of `useReducer`. Useful for cases when state is represented as
 * key-value pair object and actions consist of setting these properties individually or resetting
 * the whole state to the initial value.
 * 
 * @param initialState initial state used for useReducer
 * @returns array with two object. First - the current value of the state. Second - all possible actions
 * for a given model.
 */
export function useReducerForModel<T extends Record<string, any>>(initialState: T): [T, DispatchActions<T> & { reset: () => void }] {
  const [val, dispatch] = useReducer((state: T, action: SetterAction<any>) => {
    const prop = action.type.substring(4);
    const lowerCaseProp = prop.charAt(0).toLowerCase() + prop.slice(1);
    if (action.type === '_RESET') {
      return initialState;
    }
    return { ...state, [lowerCaseProp]: action.payload };
  }, initialState);

  const actionsCreators = generateActionCreators(initialState);

  const actions = {} as DispatchActions<T>;

  for (const key in actionsCreators) {
    actions[key] = (payload: T[keyof T]) => {
      const actionCreator = actionsCreators[key] as any;
      dispatch(actionCreator(payload));
    }
  }

  actions['reset'] = () => dispatch({ type: '_RESET' });

  return [val, actions as (DispatchActions<T> & { reset: () => void })];
}
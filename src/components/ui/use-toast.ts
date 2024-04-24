import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

// The maximum number of toast notifications to display at once.
const TOAST_LIMIT = 1;
// The delay before removing a toast notification.
const TOAST_REMOVE_DELAY = 1000000;

// Represents a toast notification with additional properties.
type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

// Defines the action types for the toast component.
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

// Generates a unique ID for a toast notification.
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}


// The action type for the toast state.
type ActionType = typeof actionTypes;
type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

// A map of toast IDs to their respective setTimeout return values.
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

// Adds a toast to the remove queue.
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

{/* Clear the timeout if it exists */}
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

// The reducer function for the toast state.
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    // Update the state to add a new toast.
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

      // Update the state to update the toast.
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t,
        ),
      };

      // Update the state to dismiss the toast.
    case "DISMISS_TOAST": {
      const { toastId } = action;

      // If a toast ID is provided, add it to the remove queue.
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      // Update the state to close the toast.
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }
    // Update the state to remove the toast.
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      // Remove the toast from the state.
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

// A list of listeners for the toast state.
const listeners: Array<(state: State) => void> = [];

// The initial state of the toast state.
let memoryState: State = { toasts: [] };

// Dispatches an action to the toast state.
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

// Represents a toast notification with additional properties.
type Toast = Omit<ToasterToast, "id">;

// Creates a new toast notification.
function toast({ ...props }: Toast) {
  const id = genId();

  // Updates the toast notification.
  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
    // Dismisses the toast notification.
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  // Adds the toast notification to the state.
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  // Returns the toast notification.
  return {
    id: id,
    dismiss,
    update,
  };
}

// The hook for the toast state.
function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  // Adds the listener to the toast state.
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  // Returns the toast state.
  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

// The default export for the toast module.
export { useToast, toast };

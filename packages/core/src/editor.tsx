import * as React from 'react'
import { HotKeys } from 'react-hotkeys'
import { Document } from './document'
import { EditorContext } from './editor-context'
import {
  ActionType,
  hasPendingChanges,
  reducer,
  createInitialState,
  getRoot,
  pendingChanges
} from './store'
import { Plugin } from './plugin'

export function Editor<K extends string = string>({
  plugins,
  defaultPlugin,
  initialState,
  changed,
  children,
  editable = true
}: EditorProps<K>) {
  const [state, dispatch] = React.useReducer(
    reducer,
    createInitialState(plugins, defaultPlugin, editable)
  )

  React.useEffect(() => {
    dispatch({
      type: ActionType.InitRoot,
      payload: initialState || {}
    })
  }, [dispatch, initialState])

  React.useEffect(() => {
    dispatch({
      type: ActionType.SwitchEditable,
      payload: editable
    })
  }, [editable])

  const id = getRoot(state)

  const pending = React.useRef(0)
  React.useEffect(() => {
    if (changed && pending.current !== pendingChanges(state)) {
      pending.current = pendingChanges(state)
      changed(hasPendingChanges(state))
    }
  }, [changed, state])

  if (!id) {
    return null
  }

  return (
    <HotKeys
      keyMap={{
        UNDO: 'mod+z',
        REDO: ['mod+y', 'mod+shift+z']
      }}
      handlers={{
        UNDO: () =>
          dispatch({
            type: ActionType.Undo
          }),
        REDO: () =>
          dispatch({
            type: ActionType.Redo
          })
      }}
    >
      <EditorContext.Provider
        value={{
          state,
          dispatch
        }}
      >
        <Document id={id} />
        {children}
      </EditorContext.Provider>
    </HotKeys>
  )
}

export interface EditorProps<K extends string = string> {
  children?: React.ReactNode
  plugins: Record<K, Plugin>
  defaultPlugin: K
  initialState?: {
    plugin: string
    state?: unknown
  }
  changed?: (changed: boolean) => void
  editable?: boolean
}

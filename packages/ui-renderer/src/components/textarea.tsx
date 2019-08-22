import * as React from 'react'
import { IgnoreKeys } from 'react-hotkeys'
import TextareaAutosize, {
  TextareaAutosizeProps
} from 'react-textarea-autosize'

import { styled } from '../theme'

const Textarea = styled(TextareaAutosize)({
  minHeight: '100px',
  width: '100%',
  margin: 'auto',
  padding: '10px',
  resize: 'none',
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  border: 'none',
  outline: 'none',
  boxShadow: '0 1px 1px 0 rgba(0,0,0,0.50)',
  '&::-webkit-input-placeholder': {
    color: 'rgba(0,0,0,0.5)'
  }
})

export function EditorTextarea(
  props: Omit<TextareaAutosizeProps, 'as' | 'ref'>
) {
  return (
    <IgnoreKeys>
      <Textarea {...props} />
    </IgnoreKeys>
  )
}
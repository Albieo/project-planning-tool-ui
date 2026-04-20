import { createFormHook, useStore } from '@tanstack/react-form'

import {
  Select,
  SubscribeButton,
  Switch,
  TextArea,
  TextField,
} from '../components/FormComponents'
import { fieldContext, formContext, useFieldContext } from './form-context'

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    Select,
    TextArea,
    Switch,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
})

export function useFieldMeta<T>() {
  const field = useFieldContext<T>()

  const { errors, isTouched } = useStore(field.store, (state) => ({
    errors: state.meta.errors,
    isTouched: state.meta.isTouched,
  }))

  const hasError = isTouched && errors.length > 0
  const errorId = `${field.name}-error`

  return {
    field,
    errors,
    hasError,
    errorId,
  }
}

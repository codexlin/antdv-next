import type { Components } from '@v-c/picker'
import PickerButton from '../PickerButton'

export default function useComponents(components?: Components) {
  return {
    button: PickerButton,
    ...(components ?? {}),
  }
}

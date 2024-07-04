import { Direction } from '@mui/material'

export interface TreeNode {
  id: string
  label: string
  value: string
  parentId?: string
  children: Array<TreeNode>
  disabled?: boolean
  title?: string
}

export type CheckboxTreeProps = {
  nodes: TreeNode[]
  setChecked: (checked: string[]) => void
  setExpanded: (expanded: string[]) => void
  expanded: string[]
  checked: string[]
  direction: Direction
  onHandleDelete?: (node: TreeNode) => Promise<void>
  onHandleEdit?: (node: TreeNode) => void
}

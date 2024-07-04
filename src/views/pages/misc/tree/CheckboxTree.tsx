import React from 'react'
import { CheckboxTreeProps, TreeNode } from 'src/types/apps/CheckboxTreeTypes'

import TreeItem from '@mui/lab/TreeItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import TreeView from '@mui/lab/TreeView'
import Icon from 'src/@core/components/icon'
import { isDefined, leafIds } from 'src/utils/miscellaneous'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Translations from 'src/layouts/components/Translations'
import IconButton from '@mui/material/IconButton'

function CheckboxTree({
  checked,
  setChecked,
  onHandleDelete,
  expanded,
  setExpanded,
  direction,
  nodes,
  onHandleEdit
}: CheckboxTreeProps) {
  const handleCheck = (node: TreeNode, newValue: boolean) => {
    const value = checked.includes(node.id)
    if (!node.children || node.children.length === 0) {
      if (value === newValue) return
      setChecked(newValue ? [...checked, node.id] : checked.filter(id => id !== node.id))
    } else {
      const ids = leafIds(node)
      const remaining = checked.filter(id => !ids.includes(id))
      setChecked(newValue ? [...remaining, ...ids] : remaining)
    }
  }

  const renderTreeNodes = (nodes: TreeNode[]) => {
    return nodes.map(node => {
      const key = node.id
      const isChecked = leafIds(node).every(id => checked.includes(id))
      const isIndeterminate = !isChecked && leafIds(node).some(id => checked.includes(id))

      const onChange = () => {
        handleCheck(node, !isChecked)
      }

      const children = Array.isArray(node.children) ? renderTreeNodes(node.children) : null

      return (
        <TreeItem
          sx={{
            '& .MuiTreeItem-label .MuiFormControlLabel-root': {
              width: '100%'
            },
            '& .MuiFormControlLabel-root .MuiFormControlLabel-label': {
              width: { xs: '90%', md: '95%', lg: '96%' }
            }
          }}
          key={key}
          nodeId={key}
          label={
            <FormControlLabel
              control={
                <Checkbox
                  checked={isChecked}
                  onChange={onChange}
                  onClick={e => e.stopPropagation()}
                  indeterminate={isIndeterminate}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Tooltip title={<Translations text={node.label} />}>
                    <Box
                      component={'span'}
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {node.label}
                    </Box>
                  </Tooltip>
                  <Box sx={{ display: 'flex' }}>
                    {isDefined(onHandleEdit) && (
                      <Tooltip title={<Translations text={'Edit'} />}>
                        <IconButton
                          size='small'
                          sx={{ mx: 1 }}
                          color='primary'
                          onClick={event => {
                            event.stopPropagation()
                            onHandleEdit(node)
                          }}
                        >
                          <Icon icon='tabler:edit' fontSize='1.2rem' />
                        </IconButton>
                      </Tooltip>
                    )}
                    {isDefined(onHandleDelete) && (
                      <Tooltip title={<Translations text={'Delete'} />}>
                        <IconButton
                          size='small'
                          color='error'
                          onClick={event => {
                            event.stopPropagation()
                            onHandleDelete(node)
                          }}
                        >
                          <Icon icon='tabler:trash' fontSize='1.2rem' />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              }
              key={node.id}
            />
          }
        >
          {children}
        </TreeItem>
      )
    })
  }

  const ExpandIcon = direction === 'rtl' ? 'tabler:chevron-left' : 'tabler:chevron-right'

  return (
    <TreeView
      defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
      defaultExpandIcon={<Icon icon={ExpandIcon} />}
      expanded={expanded}
      onNodeToggle={(_, nodes) => setExpanded(nodes)}
    >
      {renderTreeNodes(nodes)}
    </TreeView>
  )
}

export default CheckboxTree

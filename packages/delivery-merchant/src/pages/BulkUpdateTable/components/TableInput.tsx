import { Checkbox, Select, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { measurementSystem } from 'config/constants'
import React, { useEffect, useRef, useState } from 'react'
import { ActionTypes } from '../BulkUpdateTable'

interface TableInputProps {
  value: any
  onChangeHandler: any
  keyValue: any
  keys: any
  _id: any
}

const TableInput: React.FC<TableInputProps> = ({ value, onChangeHandler, keyValue, keys, _id }) => {
  const ref = useRef()
  console.log(keyValue)

  return value === 'isActive' ? (
    <Checkbox
      ref={ref}
      defaultChecked={keyValue}
      onChange={(e) => {
        console.log('hghgf')
        console.log(keyValue)
        if (keys.length > 1) {
          onChangeHandler({
            type: ActionTypes.ON_CHANGE_HANDLER,
            payload: {
              value: !keyValue,
              firstChangedKey: keys[0],
              changedKey: keys[1],
              _id,
            },
          })
          return
        }

        onChangeHandler({
          type: ActionTypes.ON_CHANGE_HANDLER,
          payload: {
            value: !keyValue,
            firstChangedKey: keys[0],

            _id,
          },
        })
      }}
      // onBlur={(e) => {
      //   onChangeHandler({
      //     type: ActionTypes.ON_CHANGE_HANDLER,
      //     payload: {
      //       value: e.target.checked,
      //       firstChangedKey: keys[0],
      //       changedKey: keys[1],
      //       _id,
      //     },
      //   })
      // }}
    />
  ) : value === 'measurementSystem' ? (
    <Select
      defaultValue={keyValue}
      data={measurementSystem}
      onChange={(e) => {
        console.log(keyValue)

        if (keys.length > 1) {
          onChangeHandler({
            type: ActionTypes.ON_CHANGE_HANDLER,
            payload: {
              value: e,
              firstChangedKey: keys[0],
              changedKey: keys[1],
              _id,
            },
          })
          return
        }
        onChangeHandler({
          type: ActionTypes.ON_CHANGE_HANDLER,
          payload: {
            value: e,
            firstChangedKey: keys[0],
            // changedKey: keys[1],
            _id,
          },
        })
      }}
    />
  ) : (
    // <TableInput
    //   value={keyValue}
    //   changeHandler={(e) =>
    //     onChangeHandler({
    //       value: e,
    //       firstChangedKey: keys[0],
    //       changedKey: keys[1],
    //       _id,
    //     })
    //   }
    // />
    <TextInput
      // value={keyValue}
      // onChange={(e) =>
      //   onChangeHandler({
      //     type: ActionTypes.ON_CHANGE_HANDLER,
      //     payload: {
      //       value: e.currentTarget.value,
      //       firstChangedKey: keys[0],
      //       changedKey: keys[1],
      //       _id,
      //     },
      //   })
      // }

      defaultValue={keyValue}
      onBlur={(e) => {
        console.log(e)

        onChangeHandler({
          type: ActionTypes.ON_CHANGE_HANDLER,
          payload: {
            value: e.currentTarget.value,
            firstChangedKey: keys[0],
            changedKey: keys[1],
            _id,
          },
        })
      }}
    />
  )
}

export default TableInput

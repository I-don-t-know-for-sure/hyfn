import { add } from "mathjs"

export const calculateAddOns = (addOns: any) => {
    const keys = Object.keys(addOns)
    const total = keys.reduce((accu, curr) => {
    return add(accu, addOns[curr])
    }, 0)
  return total
  }
import React from 'react'


import { HandleRefresh } from 'src/types/global'
import { useRouter } from 'next/router'
import { TreeNode } from 'src/types/apps/CheckboxTreeTypes'
import { NewTopic } from 'src/generated-sources/swagger-api'
import { Parser, createParser } from 'nuqs'
import format from 'date-fns/format'
import { parse } from 'date-fns'
import { AppAbility, defaultACLObj } from 'src/configs/acl'
import { AnyAbility } from '@casl/ability'

export const toCamelCase = (text: string): string => text.replace(/([a-z])([A-Z])/g, '$1_$2')

export function customAbilityCan(expression: string | undefined, ability: AppAbility | AnyAbility, subject?: string) {
  // Remove whitespace from the expression
  const finalExpression = expression?.replace(/\s/g, '') || defaultACLObj.action
  const finalSubject = subject || defaultACLObj.subject

  // Extract the values from the expression using a regular expression
  const valueRegex = /[^&|!()]+/g
  const uniqueValues = [...new Set(finalExpression.match(valueRegex))]

  // Create a function from the expression string
  const func = new Function('ability', 'subject', ...uniqueValues, `return ${finalExpression}`)

  // Evaluate the function with the ability.can method, subject, and extracted values
  return func(ability?.can, finalSubject, ...uniqueValues.map(v => ability?.can(v, finalSubject)))
}

/**
 * Generic type definition that describes a 'not undefined' type.
 */
export type Defined<T> = T extends undefined ? never : T

/**
 * Generic type guard function for values runtime-checked as defined.
 *
 * @param argument - The argument to check.
 *
 * @returns The boolean describing the assertion.
 * @remarks Uses the {@link Defined} type as returned value.
 */
export function isDefined<T>(argument: T): argument is Defined<T> {
  return !!argument
}

export function isStrictDefined<T>(argument: T): argument is Defined<T> {
  return argument !== undefined
}

/**
 * Generic type definition that describes a 'not undefined or null or empty object or empty array or empty string or zero' type.
 */
export type NonEmpty<T> = T extends undefined | null | {} | [] | '' | 0 ? never : T

/**
 * Generic type guard function for values runtime-checked as not undefined, not null, not an empty object, not an empty array, not an empty string, and not zero.
 *
 * @param argument - The argument to check.
 *
 * @returns The boolean describing the assertion.
 * @remarks Uses the {@link NonEmpty} type as returned value.
 */
export function isNonEmpty<T>(argument: T): argument is NonEmpty<T> {
  return (
    argument !== undefined &&
    argument !== null &&
    argument !== '' &&
    argument !== 0 &&
    !(
      typeof argument === 'object' &&
      (Object.keys(argument).length === 0 || (Array.isArray(argument) && argument.length === 0))
    )
  )
}

type ITreeItem<T> = T & {
  children: ITreeItem<T>[]
}

type IItemKey = string

export function createTree<T extends Record<string, any>>(
  flatList: T[],
  idKey: keyof T,
  parentKey: keyof T
): ITreeItem<T>[] {
  const tree: ITreeItem<T>[] = []

  // hash table.
  const mappedArr: Record<IItemKey, ITreeItem<T>> = {}
  flatList.forEach(el => {
    const elId = el[idKey] as IItemKey

    mappedArr[elId] = { ...el, children: [] }
  })

  flatList.forEach((elem: T) => {
    const mappedElem = mappedArr[elem[idKey] as IItemKey]

    if (elem[parentKey]) {
      const IItemKeyParentKey = elem[parentKey] as IItemKey
      if (mappedArr[IItemKeyParentKey]) {
        mappedArr[IItemKeyParentKey].children.push(mappedElem)
      } else {
        // Handle cases where the parent key is not found in mappedArr.
        // You can choose how to handle this situation, e.g., log an error message, throw an exception, or add the element to the root level.
        console.warn(`Parent key not found in mappedArr: ${IItemKeyParentKey}`)
        tree.push(mappedElem)
      }
    } else {
      tree.push(mappedElem)
    }
  })

  return tree
}

type EnumObject<T> = {
  [key: string]: T
}

type KeyValueList<K, V> = { id: number; key: K; value: V }[]

export const generateEnumKeyList = <T extends string>(enumObject: EnumObject<T>): { id: number; name: string }[] => {
  return Object.keys(enumObject).map((key, index) => ({
    id: index,
    name: key
  }))
}

export const generateEnumValueList = <T>(enumObject: EnumObject<T>): { id: number; name: T }[] => {
  return Object.keys(enumObject).map((key, index) => ({
    id: index,
    name: enumObject[key]
  }))
}

export const generateKeyValueList = <K extends string, V>(obj: Record<K, V>): KeyValueList<K, V> => {
  return Object.keys(obj).map((key, index) => ({
    id: index,
    key: key as K,
    value: obj[key as K]
  }))
}

export function getLeafNodes<T>(items: ITreeItem<T>[]): ITreeItem<T>[] {
  const leafNodes: ITreeItem<T>[] = []

  for (const item of items) {
    if (!item.children || item.children.length === 0) {
      leafNodes.push(item)
    } else {
      leafNodes.push(...getLeafNodes(item.children))
    }
  }

  return leafNodes
}

export function deepEqual(object1: { [key: string]: any }, object2: { [key: string]: any }): boolean {
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)
  if (keys1.length !== keys2.length) {
    return false
  }
  for (const key of keys1) {
    const val1 = object1[key]
    const val2 = object2[key]
    const areObjects = isObject(val1) && isObject(val2)
    if ((areObjects && !deepEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
      return false
    }
  }

  return true
}

export const equalsCheck = <T extends { [key: string]: any } | null | undefined>(a: T, b: T): boolean => {
  // If they point to the same instance of the array
  if (a === b) return true

  // If they point to the same instance of date
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime()

  // If both of them are null/undefined or their type is not an object
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) return a === b

  // This means the elements (not null/undefined) are objects
  const aProto = Object.getPrototypeOf(a)
  const bProto = Object.getPrototypeOf(b)

  // If they are not the same type of objects
  if (aProto !== bProto) return false

  // Check if both of the objects have the same number of keys
  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) return false

  // Check recursively for every key in both
  return keys.every(k => equalsCheck<any>(a[k], b[k]))
}

export function convertArrayToObject<T extends { id: number }>(data: T[]): { [id: number]: T } {
  return data.reduce((acc: { [id: number]: T }, item: T) => {
    acc[item.id] = item

    return acc
  }, {})
}

export const dateStringFormat = 'yyyy-MM-dd'

export const parseAsDate = createParser({
  parse: v => {
    const date = parse(v, dateStringFormat, new Date())
    if (Number.isNaN(date.valueOf())) {
      return null
    }

    return date
  },
  serialize: (v: Date) => format(v, dateStringFormat)
})

export function safeParse<T>(parser: Parser<T>['parse'], value: string, key?: string) {
  try {
    return parser(value)
  } catch (error) {
    console.warn('[nuqs] Error while parsing value `%s`: %O' + (key ? ' (for key `%s`)' : ''), value, error, key)

    return null
  }
}

export function customParseAsArrayOf<ItemType>(itemParser: Parser<ItemType>, separator = ',') {
  const itemEq = itemParser.eq ?? ((a: ItemType, b: ItemType) => a === b)
  const encodedSeparator = encodeURIComponent(separator)
  // todo: Handle default item values and make return type non-nullable

  return createParser({
    parse: query => {
      if (query === '') {
        // Empty query should not go through the split/map/filter logic,
        // see https://github.com/47ng/nuqs/issues/329
        return [] as ItemType[]
      }

      return query
        .split(separator)
        .map((item, index) => safeParse(itemParser.parse, item.replaceAll(encodedSeparator, separator), `[${index}]`))
        .filter(value => value !== null && value !== undefined) as ItemType[]
    },
    serialize: values =>
      values
        .map<string>(value => {
          const str = itemParser.serialize ? itemParser.serialize(value) : String(value)

          return str.replaceAll(separator, encodedSeparator)
        })
        .join(separator),
    eq(a, b) {
      if (a === b) {
        return true // Referentially stable
      }
      if (a.length !== b.length) {
        return false
      }

      return a.reduce((aType, bType) => aType && b.includes(bType), true)
    }
  })
}

function isObject(object: any): boolean {
  return object != null && typeof object === 'object'
}

export function union<T>(...sets: Set<T>[]): Set<T> {
  return sets.reduce((combined: Set<T>, list: Set<T>) => {
    return new Set([...combined, ...list])
  }, new Set<T>())
}

export function ignoreOrderCompare<T>(array1: Array<T>, array2: Array<T>): boolean {
  if (array1.length !== array2.length) return false
  const elements = new Set([...array1, ...array2])
  for (const x of elements) {
    const count1 = array1.filter(e => e === x).length
    const count2 = array2.filter(e => e === x).length
    if (count1 !== count2) return false
  }

  return true
}

export const handleRefresh = async ({ setRefresh, func, funcArgs = [] }: HandleRefresh): Promise<void> => {
  setRefresh(true)
  if (func && typeof func === 'function' && func.constructor.name === 'AsyncFunction') {
    await func(...funcArgs)
  } else if (func && typeof func === 'function') {
    func(...funcArgs)
  }
  setRefresh(false)
}

export const useRouterRef = () => {
  const router = useRouter()
  const routerRef = React.useRef(router)
  routerRef.current = router

  return routerRef
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export function calculateNewPage(
  pageSize: number,
  previousPageSize: number,
  previousPage: number,
  totalRecords: number
) {
  const previousTotalPages = Math.ceil(totalRecords / previousPageSize)
  const previousEndRecord = previousPage * previousPageSize
  const previousStartRecord = previousEndRecord - previousPageSize
  const newStartRecord = Math.floor(previousStartRecord * (pageSize / previousPageSize))
  const newEndRecord = newStartRecord + pageSize
  const newTotalPages = Math.ceil(totalRecords / pageSize)
  const newPage = Math.ceil(newEndRecord / pageSize)

  if (newPage > newTotalPages) {
    return newTotalPages
  } else {
    return newPage
  }
}

export function highlight(text: string, highlightWords: Array<string>) {
  return highlightWords.reduce((acc, word) => {
    const escapedHighlightWords = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    const regex = new RegExp(`(${escapedHighlightWords})`, 'gi')

    return acc.replace(regex, `<span style="background-color: yellow">$1</span>`)
  }, text)
}

export function leafIds(node: TreeNode): string[] {
  return !node.children || node.children.length === 0 ? [node.id] : node.children.map(leafIds).flat()
}


export function getCountryCodeFromLocale(locale: string) {
  const parts = locale.split('-')

  return parts.length > 1 ? parts[1] : 'unknown'
}

export function getExtension(filename: string) {
  return filename.split('.').pop()
}

export function getLastFolderName(path: string) {
  // If the path is just a single slash, return an empty string
  if (path === '/') {
    return ''
  }

  // Remove trailing slash if it exists
  path = path.replace(/\/$/, '')

  // Split the path by slashes and return the last folder name
  return path.split('/').pop()
}

export const downloadFile = (responseData: Blob, fileName: string) => {
  const urlBlob = window.URL.createObjectURL(responseData)
  const link = document.createElement('a')
  link.href = urlBlob
  link.download = fileName
  link.click()
}

export const convertToTopics = (list: Array<string>, score: number): Array<NewTopic> => {
  return list.map((value, index) => ({
    text: value,
    score: score
  }))
}

export const createIdMap = <T, K>(items: T[], keyMapper: (item: T) => [K, T]): Map<K, T> => {
  return new Map(items.map(keyMapper))
}

export function secondsToTime(seconds: number) {
  const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0'),
    s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0')

  return m + ':' + s
}

export function DateFormat(date: Date | number, language: string) {
  return new Intl.DateTimeFormat(language).format(date)
}

export function splitPath(path: string): string[] {
  return path
    .split('/')
    .filter((segment: string) => segment.length > 0)
    .reduce((result: string[], segment: string, index: number, arr: string[]) => {
      const currentPath: string = (index === 0 ? '/' : result[index - 1] + '/') + segment

      return result.concat(currentPath)
    }, [])
}

export function formatByteValue(value: number, language = 'en'): string {
  const byteValueNumberFormatter = Intl.NumberFormat(language, {
    notation: 'compact',
    style: 'unit',
    unit: 'byte',
    unitDisplay: 'narrow'
  })

  return byteValueNumberFormatter.format(value).replace(/([A-Za-z]+)/, ' $1')
}

export function DateToUnixTimestamp(date: Date) {
  // Create a new Date object representing the start of the day in UTC
  const DayUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))

  // Convert this date to a Unix timestamp (in seconds)
  return Math.floor(DayUTC.getTime() / 1000)
}

export function isURLValid(urlString: string): boolean {
  try {
    // If the URL was successfully parsed, it is valid.
    const url = new URL(urlString)

    return true
  } catch (error) {
    // If an error is thrown, the URL is not valid.
    return false
  }
}

export function removeKeys<T>(object: T, removeNull = false, ...keys: (keyof T)[]): Partial<T> {
  const newObj = {} as Partial<T>
  for (const key in object as object) {
    if (!keys.includes(key as keyof T) && (!removeNull || isNonEmpty(object[key as keyof T]))) {
      newObj[key as keyof T] = object[key as keyof T]
    }
  }

  return newObj
}

export const levenshteinDistance = (s: string, t: string): number => {
  if (!s.length) return t.length
  if (!t.length) return s.length
  const arr = []
  for (let i = 0; i <= t.length; i++) {
    arr[i] = [i]
    for (let j = 1; j <= s.length; j++) {
      arr[i][j] =
        i === 0
          ? j
          : Math.min(arr[i - 1][j] + 1, arr[i][j - 1] + 1, arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1))
    }
  }

  return arr[t.length][s.length]
}

export const orderByParentChildRelationship = <T extends { id: string | number; parentId?: string | number }>(
  data: T[]
): T[] => {
  return data.reduce((acc: T[], obj: T) => {
    if (obj?.parentId === null) {
      acc.push(obj)
    } else {
      const parentIndex = acc.findIndex(item => item.id === obj.parentId)
      if (parentIndex !== -1) {
        acc.splice(parentIndex + 1, 0, obj)
      }
    }

    return acc
  }, [])
}

/* eslint-disable ts/no-invalid-this */

import type { CancelablePromise, Monaco } from '../type'

// eslint-disable-next-line ts/ban-types
export function compose(...funcs: Function[]) {
  return (arg: unknown) => {
    return funcs.reduceRight((composed, f) => f(composed), arg)
  }
}
export function curry(fn: (...args: any[]) => any) {
  return function curried(...args: any[]) {
    return args.length >= fn.length
      // @ts-expect-error
      ? fn.apply(this, args)
      // @ts-expect-error
      : (...nextArgs: any[]) => curried.apply(this, [...args, ...nextArgs])
  }
}

export function deepMerge(target: any, source: any) {
  Object.keys(source).forEach((key) => {
    if (source[key] instanceof Object) {
      if (target[key])
        Object.assign(source[key], deepMerge(target[key], source[key]))
    }
  })

  return { ...target, ...source }
}

export function isObject(value: any): boolean {
  return Object.prototype.toString.call(value).includes('Object')
}

export function isFunction(value: any): value is (...args: any[]) => any {
  return typeof value === 'function'
}

export function isEmpty(obj: Record<string, any>) {
  return Reflect.ownKeys(obj).length === 0
}

export function hasOwnProperty(object: Record<string, any>, property: string) {
  return Object.prototype.hasOwnProperty.call(object, property)
}

const CANCELATION_MESSAGE = {
  type: 'cancelation',
  msg: 'operation is manually canceled',
}

export function makeCancelable(promise: Promise<any>) {
  let hasCanceled_ = false

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then((val: Monaco) => hasCanceled_ ? reject(CANCELATION_MESSAGE) : resolve(val))
    promise.catch(reject)
  }) as CancelablePromise<Monaco>
  Object.assign(wrappedPromise, {
    cancel() {
      hasCanceled_ = true
    },
  })
  return wrappedPromise
}

export { CANCELATION_MESSAGE }

/* eslint-disable @typescript-eslint/prefer-function-type */
export type TupleToUnion<T> = T extends Readonly<[infer F, ...infer R]>
  ? F | TupleToUnion<R>
  : T extends Readonly<Array<infer R>>
  ? R
  : never

export type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

type _HalfEquals<A, B> = (
  A extends unknown
  ? (
    B extends unknown
    ? A extends B
    ? B extends A
    ? keyof A extends keyof B
    ? keyof B extends keyof A
    ? A extends object
    ? _DeepHalfEquals<A, B, keyof A> extends true
    ? 1
    : never
    : 1
    : never
    : never
    : never
    : never
    : unknown
  ) extends never
  ? 0
  : never
  : unknown
) extends never
  ? true
  : false
type _DeepHalfEquals<A, B extends A, K extends keyof A> = (
  K extends unknown ? (Equals<A[K], B[K]> extends true ? never : 0) : unknown
) extends never
  ? true
  : false

export type Equals<A, B> = _HalfEquals<A, B> extends true
  ? _HalfEquals<B, A>
  : false

export type Exact<A, B, Y = unknown, N = never> = Equals<A, B> extends true
  ? Y
  : N

export type OnlyEvents<T> = Pick<T, OnlyEventNames<keyof T>>

export type OnlyEventNames<K extends string | number | symbol> = K extends `on${Capitalize<string>}` ? K : never

// prettier-ignore
export type EventName<T extends string> = `on${Capitalize<T>}`

// prettier-ignore
export type RemoveOnPrefix<T extends string> = T extends `on${infer K}` ? Uncapitalize<K> : T

export type Overloads<T> =
  T extends {
    (...args: infer A1): infer R1;
    (...args: infer A2): infer R2;
    (...args: infer A3): infer R3;
    (...args: infer A4): infer R4;
    (...args: infer A5): infer R5;
    (...args: infer A6): infer R6;
  } ? [
    (...args: A1) => R1,
    (...args: A2) => R2,
    (...args: A3) => R3,
    (...args: A4) => R4,
    (...args: A5) => R5,
    (...args: A6) => R6
  ] : T extends {
    (...args: infer A1): infer R1;
    (...args: infer A2): infer R2;
    (...args: infer A3): infer R3;
    (...args: infer A4): infer R4;
    (...args: infer A5): infer R5;
  } ? [
    (...args: A1) => R1,
    (...args: A2) => R2,
    (...args: A3) => R3,
    (...args: A4) => R4,
    (...args: A5) => R5
  ] : T extends {
    (...args: infer A1): infer R1;
    (...args: infer A2): infer R2;
    (...args: infer A3): infer R3;
    (...args: infer A4): infer R4
  } ? [
    (...args: A1) => R1,
    (...args: A2) => R2,
    (...args: A3) => R3,
    (...args: A4) => R4
  ] : T extends {
    (...args: infer A1): infer R1;
    (...args: infer A2): infer R2;
    (...args: infer A3): infer R3
  } ? [
    (...args: A1) => R1,
    (...args: A2) => R2,
    (...args: A3) => R3
  ] : T extends {
    (...args: infer A1): infer R1;
    (...args: infer A2): infer R2
  } ? [
    (...args: A1) => R1,
    (...args: A2) => R2
  ] : T extends {
    (...args: infer A1): infer R1
  } ? [
    (...args: A1) => R1
  ] : any


export type KnownKeys<T> = {
  [K in keyof T as string extends K
  ? never
  : number extends K
  ? never
  : K]: T[K];
}

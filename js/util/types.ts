
export type Primitive =
  | bigint
  | boolean
  | null
  | number
  | string
  | symbol
  | undefined;

export type PlainObject = Record<string, Primitive>;

export type GetFunction = (data: any, type: string, row: any, meta: any) => any;
export type SetFunction = (data: any, type: string, row: any, meta?: any) => any;

export type JSONValue = Primitive | JSON | JSONArray;
export interface JSONArray extends Array<JSONValue> { }

export interface JSON {
  [key: string]: JSONValue;
}


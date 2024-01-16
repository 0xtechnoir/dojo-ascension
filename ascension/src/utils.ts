import moment from "moment";
import {
  Entity,
  setComponent,
  Component,
  Components,
  ComponentValue,
  Type as RecsType,
  Schema,
} from "@dojoengine/recs";

export enum Direction {
  Left = 1,
  Right = 2,
  Up = 3,
  Down = 4,
}

export function updatePositionWithDirection(
  direction: Direction,
  value: { vec: { x: number; y: number } }
) {
  switch (direction) {
      case Direction.Left:
          value.vec.x--;
          break;
      case Direction.Right:
          value.vec.x++;
          break;
      case Direction.Up:
          value.vec.y--;
          break;
      case Direction.Down:
          value.vec.y++;
          break;
      default:
          throw new Error("Invalid direction provided");
  }
  return value;
}

/**
 * Decodes a component based on the provided schema.
 *
 * @param {Component} component - The component description created by defineComponent(), containing the schema and metadata types.
 * @param {string[]} values - An array of string values used to populate the decoded component.
 * @returns {Object} The decoded component object.
 */
export function decodeComponent(component: Component, values: string[]): any {
  const schema: any = component.schema;
  const types: string[] = (component.metadata?.types as string[]) ?? [];
  const indices = { types: 0, values: 0 };
  return decodeComponentValues(schema, types, values, indices);
}

function decodeComponentValues(
  schema: Schema,
  types: string[],
  values: string[],
  indices: any
): any {
  // Iterate through the keys of the schema and reduce them to build the decoded component.
  return Object.keys(schema).reduce((acc: any, key) => {
      const valueType = schema[key];
      if (typeof valueType === "object") {
          // valueType is a Schema
          // it means it's a nested component. Therefore, we recursively decode it.
          acc[key] = decodeComponentValues(
              valueType as Schema,
              types,
              values,
              indices
          );
      } else {
          // valueType is a RecsType
          // If the schema key points directly to a type or is not an object,
          // we parse its value using the provided parseComponentValue function
          // and move to the next index in the values array.
          acc[key] = parseComponentValue(
              values[indices.values],
              valueType as RecsType
          );
          indices.values++;
          // the u256 type in cairo is actually { low: u128, high: u128 }
          // we need to consume two u128 values, shifting the second to compose u256
          if (types[indices.types] == "u256") {
              const value = parseComponentValue(
                  values[indices.values],
                  valueType as RecsType
              ) as bigint;
              acc[key] |= value << 128n;
              indices.values++;
          }
          indices.types++;
      }
      return acc;
  }, {});
}

/**
* Parse component value into typescript typed value
*
* @param {string} value - The value to parse
* @param {RecsType} type - The target type
*/
export function parseComponentValue(value: string, type: RecsType) {
  switch (type) {
      case RecsType.Boolean:
          return value === "0x0" ? false : true;
      case RecsType.Number:
          return Number(value);
      case RecsType.BigInt:
          return BigInt(value);
      default:
          return value;
  }
}

export const formatDate = (timestamp: number) => {
  return moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
};

export const parseError = (error: any) => {
  const json = JSON.stringify(error, null, 2);
  const parsed = JSON.parse(json);
  return parsed.reason;
};

export const extractErrorMessage = (errorString: string) => {
  // Regular expression to match the pattern of the error message
  // It looks for a string that starts with 0x followed by characters until it reaches (' and ends at ')
  const regex = /0x[0-9a-fA-F]+ \('(.+?)'\)/;
  const match = errorString.match(regex);

  // If a match is found, return the captured group (error message), otherwise return null
  return match ? match[1] : null;
};
/**
 * Determine if a value is a plain object or not
 *
 * @param value Value to check
 * @returns true if is a plain object, otherwise false
 */
export function plainObject(value: unknown) {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    let proto = Object.getPrototypeOf(value);

    return proto === null || proto === Object.prototype;
}

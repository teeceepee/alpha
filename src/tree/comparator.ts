/**
 * Comparator interface
 * https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Comparator.html
 *
 * Parameters:
 * o1 - the first object to be compared.
 * o2 - the second object to be compared.
 *
 * Returns:
 * a negative integer, zero, or a positive integer as the first argument is less than, equal to,
 * or greater than the second.
 */
export type Comparator<T> = (o1: T, o2: T) => number

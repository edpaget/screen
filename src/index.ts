type Centimeter = number;
type Kilogram = number;
type Measurement = Centimeter;
type PackageStack = 'SPECIAL' | 'STANDARD' | 'REJECTED';

/**
 * Error thrown when a measurement represents an impossible or invalid value.
 *
 * @remarks
 * This error is thrown when any dimension (width, height, length) or mass
 * is less than or equal to zero, as physical packages cannot have non-positive
 * measurements.
 *
 * @example
 * ```typescript
 * // This will throw IllegalMeasurementError
 * sort(-5, 10, 10, 20);
 *
 * // This will also throw IllegalMeasurementError
 * sort(10, 0, 10, 20);
 * ```
 */
export class IllegalMeasurementError extends Error {
  /**
   * Creates a new IllegalMeasurementError instance.
   *
   * @param name - The name of the measurement field (e.g., 'width', 'height', 'length', 'mass')
   * @param measure - The invalid measurement value that caused the error
   */
  constructor(name: string, measure: Measurement) {
    super(`Measurement, ${name}, must be greater than zero received: ${measure.toString()}`);
  }
}

const validateMeasurements = (measurements: Record<string, Measurement>): void => {
  for (const measurement in measurements) {
    if (measurements[measurement] <= 0) {
      throw new IllegalMeasurementError(measurement, measurements[measurement]);
    }
  }
};

const isHeavy = (mass: Kilogram): boolean => mass >= 20;

const isBulky = (dimensions: [Centimeter, Centimeter, Centimeter]): boolean =>
  dimensions.some((d) => d >= 150) || dimensions.reduce((a, b) => a * b) >= 1000000;

/**
 * Sorts a package into one of three stacks based on its dimensions and mass.
 *
 * @remarks
 * Packages are classified using the following criteria:
 * - **Bulky**: Volume \>= 1,000,000 cm³ OR any dimension \>= 150 cm
 * - **Heavy**: Mass \>= 20 kg
 *
 * Sorting rules:
 * - **STANDARD**: Neither heavy nor bulky
 * - **SPECIAL**: Either heavy OR bulky (but not both)
 * - **REJECTED**: Both heavy AND bulky
 *
 * Because this accepts dimensions as floats values will 'round' to the threshold
 * for example 19.999999999999999kg === 20kg. In practice the measuring units probably
 * have a lower precision.
 *
 * @param width - The width dimension in centimeters (must be \> 0)
 * @param height - The height dimension in centimeters (must be \> 0)
 * @param length - The length dimension in centimeters (must be \> 0)
 * @param mass - The mass of the package in kilograms (must be \> 0)
 * @returns The stack classification: 'STANDARD', 'SPECIAL', or 'REJECTED'
 *
 * @throws {@link IllegalMeasurementError}
 * Thrown when any measurement (width, height, length, or mass) is less than or equal to zero
 *
 * @example
 * ```typescript
 * // Small, light package - STANDARD
 * sort(1, 1, 1, 1); // => 'STANDARD'
 *
 * // Bulky package (volume = 1,000,000) but light - SPECIAL
 * sort(100, 100, 100, 10); // => 'SPECIAL'
 *
 * // Bulky and heavy - REJECTED
 * sort(100, 100, 100, 20); // => 'REJECTED'
 *
 * // Heavy but not bulky - SPECIAL
 * sort(10, 10, 10, 25); // => 'SPECIAL'
 *
 * // One dimension >= 150cm - SPECIAL
 * sort(150, 10, 10, 10); // => 'SPECIAL'
 * ```
 */
export function sort(
  width: Centimeter,
  height: Centimeter,
  length: Centimeter,
  mass: Kilogram
): PackageStack {
  validateMeasurements({ width, height, length, mass });
  const heavy = isHeavy(mass);
  const bulky = isBulky([width, height, length]);
  if (heavy && bulky) {
    return 'REJECTED';
  }
  if (heavy || bulky) {
    return 'SPECIAL';
  }

  return 'STANDARD';
}

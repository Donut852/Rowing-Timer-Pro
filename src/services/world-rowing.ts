/**
 * Represents a boat class.
 */
export interface BoatClass {
  /**
   * The name of the boat class.
   */
  name: string;
}

/**
 * Represents world best time information.
 */
export interface WorldBestTime {
  /**
   * The boat class for the time.
   */
  boatClass: string;
  /**
   * The world best time in seconds.
   */
  timeInSeconds: number;
}

/**
 * Asynchronously retrieves a list of boat classes.
 *
 * @returns A promise that resolves to an array of BoatClass objects.
 */
export async function getBoatClasses(): Promise<BoatClass[]> {
  // TODO: Implement this by calling an API.
  return [
    { name: 'M1x' },
    { name: 'W1x' },
    { name: 'M2-' },
    { name: 'W2-' },
  ];
}

/**
 * Asynchronously retrieves the world best time for a given boat class.
 *
 * @param boatClass The boat class to retrieve the world best time for.
 * @returns A promise that resolves to a WorldBestTime object.
 */
export async function getWorldBestTime(boatClass: string): Promise<WorldBestTime> {
  // TODO: Implement this by calling an API.
  return {
    boatClass: boatClass,
    timeInSeconds: 360,
  };
}

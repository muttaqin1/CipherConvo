export type ExtractObjValueTypes<T extends Record<any, any>> = T[keyof T]; // Extracts the provided object properties and returns a union of all properties

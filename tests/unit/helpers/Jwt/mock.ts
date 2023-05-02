import fs from 'fs/promises';
export const readFileSpy = jest.spyOn(fs, 'readFile');

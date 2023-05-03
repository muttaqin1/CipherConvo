import fs from 'fs/promises';
import jwt from 'jsonwebtoken';
export const readFileSpy = jest.spyOn(fs, 'readFile');
export const verifySpy = jest.spyOn(jwt, 'verify');
export const signSpy = jest.spyOn(jwt, 'sign');

import Type from '~enums/Types';
import { EMPTY_STRING } from '~const/common';

export const isEmpty = (value: unknown): boolean =>
  value === null || typeof value === Type.UNDEFINED || value === EMPTY_STRING;

export const isEmptyObject = <T> (value: T): boolean => isEmpty(value) ||
  (value.constructor === Object && Object.keys(value).length === 0);

export const isEmptyArray = <T> (value: T): boolean => !(value && value instanceof Array && value.length > 0);

export const isIE = (): boolean => false || !!document.documentMode;

export const isClient = (): boolean => typeof window === Type.OBJECT;


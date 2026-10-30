import { colors } from './palette';

export const graphColors = {
  // Main
  'main-avax': colors['red-30'],
  'main-eth': colors['blue-30'],
  'main-btc': colors['yellow-50'],
  'main-pol': colors['purple-100'],
  'main-sol': colors['teal-100'],

  // Random
  'random-blue-100': colors['blue-100'],
  'random-blue-80': colors['blue-80'],
  'random-blue-50': colors['blue-50'],
  'random-blue-10': colors['blue-10'],

  'random-orange-100': colors['orange-100'],
  'random-orange-80': colors['orange-80'],
  'random-orange-50': colors['orange-50'],
  'random-orange-30': colors['orange-30'],
  'random-orange-10': colors['orange-10'],

  'random-green-100': colors['green-100'],
  'random-green-80': colors['green-80'],
  'random-green-60': colors['green-60'],
  'random-green-40': colors['green-40'],
  'random-green-20': colors['green-20'],

  'random-red-100': colors['red-100'],
  'random-red-80': colors['red-80'],
  'random-red-70': colors['red-70'],
  'random-red-60': colors['red-60'],
  'random-red-50': colors['red-50'],
  'random-red-40': colors['red-40'],
  'random-red-20': colors['red-20'],
  'random-red-10': colors['red-10'],
  'random-red-5': colors['red-5'],

  'random-indigo-500': colors['indigo-500'],
  'random-indigo-80': colors['indigo-80'],

  'random-teal-400': colors['teal-400'],
  'random-teal-100': colors['teal-100'],

  'random-purple-500': colors['purple-500'],
  'random-purple-200': colors['purple-200'],
  'random-purple-50': colors['purple-50'],

  'random-yellow-100': colors['yellow-100'],
  'random-yellow-30': colors['yellow-30'],
  'random-yellow-20': colors['yellow-20'],

  'random-burgundy-300': colors['burgundy-300'],
  'random-burgundy-100': colors['burgundy-100'],

  'random-gray-70': colors['gray-70'],
  'random-gray-50': colors['gray-50'],
  'random-gray-30': colors['gray-30'],
};

export type TokenGraphColorType = keyof typeof graphColors;

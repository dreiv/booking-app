import type { StorybookConfig } from '@storybook/react-vite'

import { dirname } from 'path'
import { fileURLToPath } from 'url'

function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.ts'],
  addons: [],
  framework: getAbsolutePath('@storybook/react-vite'),
}
export default config

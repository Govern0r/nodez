import resolve from '@rollup/plugin-node-resolve'

export default {
  input: 'src/Game.js',
  output: {
    file: 'dist/Game.js',
    format: 'iife',
    name: 'Game'
  },
  plugins: [ resolve() ]
}
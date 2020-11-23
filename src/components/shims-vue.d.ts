declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.css' {
  const classes:string
  export default classes
}

// declare interface Date {
//   format(fmt: string): string;
// }
declare module "@neondatabase/serverless" {
  export function neon(
    connectionString: string
  ): (strings: TemplateStringsArray, ...params: any[]) => Promise<any[]>;
}


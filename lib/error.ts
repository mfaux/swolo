/*  
  A type-safe wrapper for errors. Errors in a `catch` block
  are typed as `unknown`, so this class ensures the `cause` is always an instance
  of `Error`.

  The `name` field is expected to hold an error code or type identifier, 
  providing more context than the generic `Error` name.

  Inspiration:
  - https://engineering.udacity.com/handling-errors-like-a-pro-in-typescript-d7a314ad4991
  - https://medium.com/with-orus/the-5-commandments-of-clean-error-handling-in-typescript-93a9cbdf1af5
*/
export class ErrorBase<TName extends string> extends Error {
  name: TName;

  constructor(name: TName, message: string, cause: unknown) {
    super(message, { cause: ensureError(cause) });
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
  }
}

class NonError extends Error {
  constructor(input: unknown) {
    let stringified = '[Unable to stringify the thrown value]';
    try {
      stringified = JSON.stringify(input);
    } catch {}

    super(stringified);
    this.name = 'NonError';
  }
}

export function ensureError(input: unknown) {
  if (input instanceof Error) {
    return input;
  }

  return new NonError(input);
}

export class MissingFieldError extends Error {
  constructor() {
    super("");
    this.name = MissingFieldError.name;
  }
}
export class InvalidFieldError extends Error {}

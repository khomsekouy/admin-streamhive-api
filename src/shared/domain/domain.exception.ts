export abstract class DomainException extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class EntityNotFoundException extends DomainException {
  readonly code = 'ENTITY_NOT_FOUND';
  constructor(entity: string, id: string) {
    super(`${entity} with id "${id}" was not found`);
  }
}

export class ValidationException extends DomainException {
  readonly code = 'DOMAIN_VALIDATION';
  constructor(message: string) {
    super(message);
  }
}

export class ConflictException extends DomainException {
  readonly code = 'DOMAIN_CONFLICT';
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedDomainException extends DomainException {
  readonly code = 'DOMAIN_UNAUTHORIZED';
  constructor(message = 'Unauthorized') {
    super(message);
  }
}

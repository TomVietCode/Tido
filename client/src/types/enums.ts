export enum UserRole {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
}

export enum Provider {
  GOOGLE = 'GOOGLE',
  LOCAL = 'LOCAL',
}

export enum PostType {
  LOST = 'LOST',
  FOUND = 'FOUND',
}

export enum PostStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  HIDDEN = 'HIDDEN',
}

export enum CategoryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  EMOJI = 'emoji',
}
import * as bcrypt from 'bcrypt';

export function hashValue(password: string) {
  return bcrypt.hash(password, 10);
}

export function verifyHash(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

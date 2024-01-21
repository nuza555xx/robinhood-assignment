import { compareSync, hashSync } from 'bcrypt';
const saltOrRounds = 10;

export class Hashing {
  static hash(payload: string): string {
    return hashSync(payload, saltOrRounds);
  }

  static compare(payload: string, hashed: string): string {
    return compareSync(payload, hashed);
  }
}

import { compareSync, hashSync } from 'bcrypt';
const saltOrRounds = 10;

export class Hashing {
  static hash(payload: string) {
    return hashSync(payload, saltOrRounds);
  }

  static compare(payload: string, hashed: string) {
    return compareSync(payload, hashed);
  }
}

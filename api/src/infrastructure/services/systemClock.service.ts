import { IClock } from "../../domain/repositories/clock.service.interface";

export class SystemClock implements IClock {
  now(): Date {
    return new Date();
  }
}

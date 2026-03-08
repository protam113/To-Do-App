// snowflake.utils.ts
import SnowflakeId from 'snowflake-id';

export const snowflake = new SnowflakeId({
  mid: 1,
  offset: (2024 - 1970) * 31536000 * 1000,
});

export function generateId(): string {
  return snowflake.generate();
}



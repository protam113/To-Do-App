import * as path from 'path';


export function getEnvFilePath(): string {
  const nodeEnv = process.env.NODE_ENV || 'local';

  const envFileMap: Record<string, string> = {
    docker: '.env.docker',
    production: '.env.docker',
    local: '.env.local',
  };

  const envFile = envFileMap[nodeEnv] || '.env.local';

  return path.join(process.cwd(), 'env', envFile);
}

/**
 * Check if running inside Docker container
 */
export function isDocker(): boolean {
  return (
    (process.env.NODE_ENV as string) === 'docker' ||
    process.env.DOCKER === 'true'
  );
}

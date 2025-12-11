export type Environment = 'dev' | 'tst' | 'sit' | 'prd';

export const ENV_LABELS: Record<Environment, string> = {
  dev: 'Development',
  tst: 'Test',
  sit: 'Staging/SIT',
  prd: 'Production',
};

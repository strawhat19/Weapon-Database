export const isRecord = (value: unknown): value is Record<string, unknown> => !!value && typeof value === `object` && !Array.isArray(value);
export const isText = (value: unknown): value is string => typeof value === `string` && value.trim().length > 0;
export const isIsoDate = (value: unknown): value is string => typeof value === `string` && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
export const errorMessage = (error: unknown) => error instanceof Error ? error.message : `The Operation Could Not Be Completed`;


export const json = (statusCode: number, body?: unknown) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body ?? {}),
});

export const badRequest = (error: string) => json(400, { error });

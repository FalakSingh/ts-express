export type TSendEmailPayload = {
  email: string;
  data: Record<string, string>;
  type: 'register' | 'forgotPass';
};

export interface IMailOptions {
  to: string;
  subject: string;
  templateName: string;
  from?: string;
  replacements?: object;
}

export interface ISmsOptions {
  to: string;
  body: string;
}
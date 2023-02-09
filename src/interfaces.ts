export interface iDeveloper {
  id?: number;
  name: string;
  email: string;
  developerInfoId?: number | null;
  [key: string]: string | number | null;
}

export interface iMessage {
  message: string;
}

export interface iCount {
  count: number;
}
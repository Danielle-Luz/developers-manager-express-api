export enum os {
  "Windows",
  "Linux",
  "MacOS"
}

export interface iDeveloper {
  id?: number;
  name: string;
  email: string;
  developerInfoId?: number | null;
  [key: string]: string | number | null;
}

export interface iDeveloperInfo {
  id?: number;
	developerSince: Date;
	preferredOs: os;
	developerId: number;
  [key: string]: string | number | Date | null;
}

export interface iDeveloperJoinDeveloperInfo {
  developerID: number,
  developerName: string,
  developerEmail: string,
  developerInfoID: number | null,
  developerInfoDeveloperSince: string | null,
  developerInfoPreferredOS: os | null
}

export interface iMessage {
  message: string;
}

export interface iCount {
  count: number;
}
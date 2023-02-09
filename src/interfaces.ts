export const os = ["Windows", "Linux", "MacOS"];

export interface iDeveloper {
  id?: number;
  name: string;
  email: string;
  developer_info_id?: number | null;
  [key: string]: string | number | null;
}

export interface iDeveloperInfo {
  id?: number;
  developer_since: Date;
  preferred_os: "";
  developer_id?: number;
  [key: string]: string | number | Date | null;
}

export interface iDeveloperJoinDeveloperInfo {
  developer_id: number;
  developer_name: string;
  developer_email: string;
  developer_info_id: number | null;
  developer_info_developer_since: string | null;
  developer_info_preferred_os: "" | null;
}

export interface iMessage {
  message: string;
}

export interface iCount {
  count: number;
}

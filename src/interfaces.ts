export const os = ["Windows", "Linux", "MacOS"];

export interface iDeveloper {
  id?: number;
  name?: string;
  email?: string;
  developerInfoId?: number | null;
  [key: string]: string | number | null;
}

export interface iDeveloperInfo {
  id?: number;
  developerSince?: Date;
  preferredOS?: "";
  developerId?: number;
  [key: string]: string | number | Date | null;
}

export interface iDeveloperJoinDeveloperInfo {
  developerId: number;
  developer_name: string;
  developer_email: string;
  developerInfoId: number | null;
  developer_info_developerSince: string | null;
  developer_info_preferredOS: "" | null;
}

export interface iProject {
  id?: number;
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate?: Date | null;
  developerId: number;
  [key: string]: string | number | Date | null;
}

interface Project {
  projectId: number;
  project_name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate: Date | null;
  developerId: number;
  technologyId: number;
  technology_name: string;
}

export interface iProjectJoinTechnologies {
  projectId: number;
  project_name: string;
  project_description: string;
  project_estimatedTime: string;
  project_repository: string;
  project_startDate: string;
  project_endDate: string | null;
  project_developerId?: number | null;
  technologyId: number | null;
  technology_name: string | null;
}

export interface iTechnology {
  id?: number;
  name: string;
  addedIn?: Date;
  [key: string]: number | string | Date;
}

export interface iId {
  id?: number;
  developerInfoId?: number | undefined;
  developerId?: number | undefined;
}

export interface iMessage {
  message: string;
  keys?: string[];
  options?: string[];
}

export interface iCount {
  count: number;
}

export type tDeveloperProjects = iDeveloperJoinDeveloperInfo &
  iProjectJoinTechnologies;

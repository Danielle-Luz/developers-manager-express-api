export const os = ["Windows", "Linux", "MacOS"];

export interface iDeveloper {
  id?: number;
  name?: string;
  email?: string;
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

export interface iProject {
  id?: number
	name: string;
	description: string;
	estimated_time: string;
	repository: string;
	start_date: Date;
	end_date?: Date | null;
	developer_id: number;
  [key: string]: string | number | Date | null;
}

interface Project {
  project_id: number;
  project_name: string;
  description: string;
  estimated_time: string;
  repository: string;
  start_date: Date;
  end_date: Date | null;
  developer_id: number;
  technology_id: number;
  technology_name: string;
}

interface iProjectJoinTechnologies {
  project_id: number;
  project_name: string;
  project_description: string;
  project_estimated_time: string;
  project_repository: string;
  project_start_date: string;
  project_end_date: string | null;
  project_developer_id: number | null;
  technology_id: number | null;
  technology_name: string | null;
}

export interface iId {
  developer_info_id?: number | undefined;
  developer_id?: number | undefined;
}

export interface iMessage {
  message: string;
}

export interface iCount {
  count: number;
}

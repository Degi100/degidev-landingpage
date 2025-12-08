// Project Status
export type ProjectStatus = 'live' | 'beta' | 'wip' | 'coming_soon';

export interface Project {
	_id: string;
	name: string;
	url: string;
	description: string;
	icon: string | null;
	repoUrl: string | null;
	stack: string[];
	status: ProjectStatus;
	order: number;
}

// Sort Types - Status zuerst oder Alphabetisch
export type SortOption = 'live' | 'beta' | 'wip' | 'coming_soon' | 'alpha';

export interface SortConfig {
	label: string;
	icon: string;
}

export const sortOptions: Record<SortOption, SortConfig> = {
	live: { label: 'Live zuerst', icon: '🟢' },
	beta: { label: 'Beta zuerst', icon: '🔵' },
	wip: { label: 'In Arbeit zuerst', icon: '🟡' },
	coming_soon: { label: 'Coming Soon zuerst', icon: '⚪' },
	alpha: { label: 'Alphabetisch', icon: '🔤' }
};

// Status Config
export interface StatusConfig {
	label: string;
	class: string;
	priority: number;
}

export const statusConfig: Record<ProjectStatus, StatusConfig> = {
	live: { label: 'Live', class: 'status-live', priority: 0 },
	beta: { label: 'Beta', class: 'status-beta', priority: 1 },
	wip: { label: 'In Arbeit', class: 'status-wip', priority: 2 },
	coming_soon: { label: 'Coming Soon', class: 'status-coming-soon', priority: 3 }
};

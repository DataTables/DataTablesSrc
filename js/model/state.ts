import { SearchOptions } from './search';

/** State object */
export interface State {
	childRows?: string[];
	columns: Array<{
		name: string | null;
		search: SearchOptions;
		visible: boolean;
	}>;
	length: number;
	order: Array<Array<string | number>>;
	search: SearchOptions;
	start: number;
	time: number;
}

/** State that can be loaded - every parameter is optional */
export interface StateLoad {
	childRows?: string[];
	columns?: Array<{
		name?: string | null;
		search?: SearchOptions;
		visible?: boolean;
	}>;
	length?: number;
	order?: Array<Array<string | number>>;
	search?: SearchOptions;
	start?: number;
	time?: number;
}

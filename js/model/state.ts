import { SearchOptions } from './search';

/** State object */
export interface State {
	time: number;
	start: number;
	length: number;
	order: Array<Array<string | number>>;
	search: SearchOptions;
	columns: Array<{
		name: string | null;
		search: SearchOptions;
		visible: boolean;
	}>;
}

/** State that can be loaded - every parameter is optional */
export interface StateLoad {
	time?: number;
	start?: number;
	length?: number;
	order?: Array<Array<string | number>>;
	search?: SearchOptions;
	columns?: Array<{
		name?: string | null;
		search?: SearchOptions;
		visible?: boolean;
	}>;
}

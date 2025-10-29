import { Search } from './search';

/** State object */
export interface State {
	time: number;
	start: number;
	length: number;
	order: Array<Array<string | number>>;
	search: Search;
	columns: Array<{
		name: string | null;
		search: Search;
		visible: boolean;
	}>;
}

/** State that can be loaded - every parameter is optional */
export interface StateLoad {
	time?: number;
	start?: number;
	length?: number;
	order?: Array<Array<string | number>>;
	search?: Search;
	columns?: Array<{
		name?: string | null;
		search?: Search;
		visible?: boolean;
	}>;
}

import { SearchObject } from './search';

/**
 * State object for reading - i.e. using `state()` as a GETTER
 */
export interface State {
	childRows?: string[];
	columns: Array<{
		name: string | null;
		search: SearchObject;
		visible: boolean;
	}>;
	length: number;
	order: Array<Array<string | number>>;
	search: SearchObject;
	searchGroups: SearchObject[];
	start: number;
	time: number;
}

/**
 * State objects for loading - i.e. using `state()` as a SETTER.
 * 
 * It is important to note that every parameter is optional in this object
 */
export interface StateLoad {
	childRows?: string[];
	columns?: Array<{
		name?: string | null;
		search?: SearchObject;
		visible?: boolean;
	}>;
	length?: number;
	order?: Array<Array<string | number>>;
	search?: SearchObject;
	searchGroups?: SearchObject[];
	start?: number;
	time?: number;
}

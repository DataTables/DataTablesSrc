
export interface WrappedHandler {
	(e: Event): any;
	delegateSelector: string | null;
	original: EventListener;
	one: boolean;
	type: string;
}

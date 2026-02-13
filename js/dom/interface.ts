export interface DomEvent extends Event {
	namespace: string;
	currentTarget: Element;
	delegateTarget: Element;
	relatedTarget: Element;
	handlerReturn: any;
	_args: unknown[];
}

export interface WrappedHandler extends EventListener {
	(e: DomEvent): any;
	delegateSelector: string | null;
	original: EventListener;
	one: boolean;
	type: string;
	namespaces: string[];
}

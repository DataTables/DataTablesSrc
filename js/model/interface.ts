import { Dom } from '../dom';
import { IFeatureDivOptions } from '../features/div';
import { IFeatureInfoOptions } from '../features/info';
import { IFeaturePagingOptions } from '../features/page';
import { IFeaturePageLengthOptions } from '../features/pageLength';
import { IFeatureSearchOptions } from '../features/search';

export interface Feature {
	/** A simple `<div>` that can contain your own content */
	div?: Partial<IFeatureDivOptions>;

	/** Table information display */
	info?: Partial<IFeatureInfoOptions>;

	/** Paging length control */
	pageLength?: Partial<IFeaturePageLengthOptions>;

	/** Pagination buttons */
	paging?: Partial<IFeaturePagingOptions>;

	/** Global search input */
	search?: Partial<IFeatureSearchOptions>;
}

type LayoutNumber = '' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

type LayoutSide = 'top' | 'bottom';

type LayoutEdge = 'Start' | 'End';

type LayoutKeys =
	| `${LayoutSide}${LayoutNumber}${LayoutEdge}`
	| `${LayoutSide}${LayoutNumber}`;

export type LayoutFeatures =
	| keyof Feature
	| Feature
	| Array<keyof Feature>
	| Feature[];

export type LayoutElement = {
	/** Class to apply to the CELL in the layout grid */
	className?: string;

	/** ID to apply to the CELL in the layout grid */
	id?: string;

	/** Class to apply to the ROW in the layout grid */
	rowClass?: string;

	/** ID to apply to the ROW in the layout grid */
	rowId?: string;

	/** List of features to show in this cell */
	features: LayoutFeatures;
};

export type LayoutComponent =
	| LayoutElement
	| LayoutFeatures
	| (() => HTMLElement)
	| HTMLElement
	| JQuery<HTMLElement>
	| Dom
	| null;

export type Layout = Partial<Record<LayoutKeys, LayoutComponent>>;

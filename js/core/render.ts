import ext from '../ext';
import {
	IRendererFooter,
	IRendererHeader,
	IRendererLayout,
	IRendererPagingButton,
	IRendererPagingContainer,
	IRendererTypes,
} from '../ext/renderer';
import { Context } from '../model/settings';
import * as is from '../util/is';

export function renderer(ctx: Context, type: 'header'): IRendererHeader;

export function renderer(ctx: Context, type: 'footer'): IRendererFooter;

export function renderer(ctx: Context, type: 'layout'): IRendererLayout;

export function renderer(
	ctx: Context,
	type: 'pagingButton'
): IRendererPagingButton;

export function renderer(
	ctx: Context,
	type: 'pagingContainer'
): IRendererPagingContainer;

export function renderer(ctx: Context, type: IRendererTypes) {
	var render = ctx.renderer;
	var host = ext.renderer[type];

	if (is.plainObject(render) && render[type]) {
		// Specific renderer for this type. If available use it, otherwise use
		// the default.
		return host[render[type]] || host._;
	}
	else if (typeof render === 'string') {
		// Common renderer - if there is one available for this type use it,
		// otherwise use the default
		return host[render] || host._;
	}

	// Use the default
	return host._;
}

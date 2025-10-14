
// Similar to jQuery's addClass, but use classList.add
export function addClass(el: HTMLElement, name: string) {
	if (name) {
		name.split(' ').forEach(function (n) {
			if (n) {
				// `add` does deduplication, so no need to check `contains`
				el.classList.add(n);
			}
		});
	}
}

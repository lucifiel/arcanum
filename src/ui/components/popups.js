const PADDING = 20;

/**
 *
 * @param {*} elm
 * @param {DOMRect} targRect
 */
const getTop = ( elm, targRect) => {

	let y = targRect.top - 40;

	return ( y < PADDING ) ? PADDING : (

		y + elm.offsetHeight > ( window.innerHeight - PADDING) ?
			(window.innerHeight - PADDING - elm.offsetHeight) : y

	);

}

export const center = elm => {

	let style = elm.style;
	style.left = (( window.innerWidth - elm.offsetWidth )/2) + 'px'

};

/**
 *
 * @param {HTMLElement} elm - element being positioned
 * @param {HTMLElement} target - target being rolled over.
 */
export const positionAt = (elm, target) =>{

	let style = elm.style;
	let rect = target.getBoundingClientRect();
	//let myBox = this.$el.getBoundingClientRect();

	let left = rect.left;
	if ( left < window.innerWidth/2 ) {

			//	console.log('left: ' + left);
		style['left'] = ( left + target.offsetWidth + 32 ) + 'px';

		} else {

		//console.log('width: ' + myBox.width + ' , ' + myBox.right );
		style['left'] = ( left- elm.offsetWidth - 32 ) + 'px';
	}

	style.top = getTop( elm, rect ) + 'px';

};

export const getChild = (targ) => {

	/**
	 * Give priority to buttons so popup wont be on click.
	 */
	if ( targ.children ) {

		let c = targ.children[0];

		for( let t of targ.children ) {

		}
	}

	return targ;

};
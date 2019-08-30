
export const center = elm => {

	let style = elm.style;
	style.left = (( window.innerWidth - elm.offsetWidth )/2) + 'px'

};

export const positionAt = (elm, target) =>{

	let style = elm.style;
	let rect = target.getBoundingClientRect();
	//let myBox = this.$el.getBoundingClientRect();

	let left = rect.left;
	if ( left < window.innerWidth/2 ) {

			//	console.log('left: ' + left);
		style['left'] = ( left + target.offsetWidth + 40 ) + 'px';

		} else {

		//console.log('width: ' + myBox.width + ' , ' + myBox.right );
		style['left'] = ( left- 240 ) + 'px';
	}

	if ( rect.top < window.innerHeight-140) style['top'] = ( rect.top ) + 'px';
	else style.top = (rect.top - 52) + 'px';

};
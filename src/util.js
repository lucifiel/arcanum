export function quickSplice( a, i ) {

	a[i] = a[ a.length-1 ];
	a.pop();

}
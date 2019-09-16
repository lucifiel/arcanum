export const uppercase = (s) => {
	return s.length > 1 ? s[0].toUpperCase() + s.slice(1) : s[0].toUpperCase();
}

export const quickSplice = ( a, i ) => {

	a[i] = a[ a.length-1 ];
	a.pop();

}


export const indexAfter = ( s, k ) => {

	let i = s.indexOf(k);
	return i >= 0 ? i + k.length : i;

}
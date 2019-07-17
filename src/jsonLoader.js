export default {

	/**
	 * 
	 * @param {*} path
	 * @returns {Promise.<>} 
	 */
	loadJSON( path ) {

		return window.fetch( path );

		/*return new Promise( (res,rej)=>{

			let req = new Request

		});*/

	}

}
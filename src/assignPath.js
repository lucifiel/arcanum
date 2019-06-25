/**
 * Combines an object path with a value to assign.
 * CURRENTLY UNUSED.
 */
export default class AssignPath {

	get value() { return this._value; }
	set value(v) { this._value = v;}

	/**
	 * @property {string} path - The variable path string.
	 */
	get path() { return this._parts.join('.'); }

	/**
	 * @property {string[]} parts - parts of the variable path.
	 */
	get parts() { return this._parts; }
	set parts(v) { this._parts = v; }

	/**
	 * 
	 * @param {string} s - path to a variable. 
	 */
	constructor(s, v) {
		this._parts = s.split('.');
		this._value = v;
	}

	/**
	 * @returns {string} The variable path as a string.
	 */
	toString() { return this._parts.join('.'); }

	/**
	 * Use the path and value to assign a path along object.
	 * Invalid paths are ignored.
	 * @param {Object} obj 
	 */
	assign( obj ) {

		let varPath = this._parts;
		if ( !varPath ) return false;

		let len = varPath.length-1;

		for (let i = 0; i < len; i++) {

			if (!(obj instanceof Object)) return false;
			obj = obj[varPath[i]];

		}

		obj[ varPath[len] ] = this._value;

		return true;

	}

	/**
	 * Reads a value from a variable path of an object's variables.
	 * @param {Object} - base object of the path.
	 * @returns {*} The value stored at the variable path, or defaultVal.
	 */
	readVar( obj ) {

		let varPath = this._parts;
		if ( !varPath ) return undefined;

		let len = varPath.length;

		for (let i = 0; i < len; i++) {

			if (!(obj instanceof Object)) return undefined;
			obj = obj[varPath[i]];

		}

		return obj;

	}

	/**
	 * Returns a property (or sub) value as a float.
	 * @param {number} [defaultVal=0] - Value to return on variable not found.
	 * @returns {number|undefined|NaN} - Numeric value stored at the variable path, or defaultVal.
	 */
	readNum( obj, defaultVal=0 ) {
		
		let varPath = this._parts;

		if ( !varPath) return undefined;

		let len = varPath.length;

		for (let i = 0; i < len; i++) {

			if (!(obj instanceof Object)) return defaultVal;
			obj = obj[varPath[i]];

		}

		return Number(obj);

	}

	/**
	 * Returns a prop or sub value as an integer.
	 * @param {Object} obj - base variable of the path.
	 * @param {number} [defaultVal=0] - value to return on variable not found.
	 * @returns {number|undefined} the variable value interpreted as an integer, or defaultVal
	 * if the variable could not be found.
	 */
	readInt( obj, defaultVal=0) {

		let varPath = this._parts;

		if ( !varPath) return undefined;
	
		let len = varPath.length;

		for (let i = 0; i < len; i++) {

			if (!(obj instanceof Object)) return defaultVal;
			obj = obj[varPath[i]];

		}

		return Number.parseInt(obj);

	}

}
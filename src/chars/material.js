import Base, {mergeClass} from '../items/base';

export default class Material {

	constructor(vars=null) {

		if ( vars ) Object.assign( this, vars);

	}

}

mergeClass( Material, Base );
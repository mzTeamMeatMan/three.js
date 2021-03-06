/**
 * @author zz85 / https://github.com/zz85
 *
 * Parametric Surfaces Geometry
 * based on the brilliant article by @prideout http://prideout.net/blog/?p=44
 */

import { Geometry } from '../core/Geometry';

function ParametricGeometry( func, slices, stacks ) {

	Geometry.call( this );

	this.type = 'ParametricGeometry';

	this.parameters = {
		func: func,
		slices: slices,
		stacks: stacks
	};

	this.fromBufferGeometry( new ParametricBufferGeometry( func, slices, stacks ) );
	this.mergeVertices();

}

ParametricGeometry.prototype = Object.create( Geometry.prototype );
ParametricGeometry.prototype.constructor = ParametricGeometry;

/**
 * @author Mugen87 / https://github.com/Mugen87
 *
 * Parametric Surfaces Geometry
 * based on the brilliant article by @prideout http://prideout.net/blog/?p=44
 */

import { BufferGeometry } from '../core/BufferGeometry';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { Vector3 } from '../math/Vector3';

function ParametricBufferGeometry( func, slices, stacks ) {

	BufferGeometry.call( this );

	this.type = 'ParametricBufferGeometry';

	this.parameters = {
		func: func,
		slices: slices,
		stacks: stacks
	};

	// buffers

	var indices = [];
	var vertices = [];
	var normals = [];
	var uvs = [];

	var EPS = 0.00001;
	var pu = new Vector3(), pv = new Vector3(), normal = new Vector3();

	var i, j;

	// generate vertices, normals and uvs

	var sliceCount = slices + 1;

	for ( i = 0; i <= stacks; i ++ ) {

		var v = i / stacks;

		for ( j = 0; j <= slices; j ++ ) {

			var u = j / slices;

			var p = func( u, v );
			vertices.push( p.x, p.y, p.z );

			// approximate tangent vectors via finite differences

			if ( u - EPS >= 0 ) {

				pu.subVectors( p, func( u - EPS, v ) );

			} else {

				pu.subVectors( func( u + EPS, v ), p );

			}

			if ( v - EPS >= 0 ) {

				pv.subVectors( p, func( u, v - EPS ) );

			} else {

				pv.subVectors( func( u, v + EPS ), p );

			}

			// cross product of tangent vectors returns surface normal

			normal.crossVectors( pu, pv ).normalize();
			normals.push( normal.x, normal.y, normal.z );

			uvs.push( u, v );

		}

	}

	// generate indices

	for ( i = 0; i < stacks; i ++ ) {

		for ( j = 0; j < slices; j ++ ) {

			var a = i * sliceCount + j;
			var b = i * sliceCount + j + 1;
			var c = ( i + 1 ) * sliceCount + j + 1;
			var d = ( i + 1 ) * sliceCount + j;

			// faces one and two

			indices.push( a, b, d );
			indices.push( b, c, d );

		}

	}

	// build geometry

	this.setIndex( indices );
	this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
	this.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
	this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

}

ParametricBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
ParametricBufferGeometry.prototype.constructor = ParametricBufferGeometry;

export { ParametricGeometry, ParametricBufferGeometry };

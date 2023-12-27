/**
 * @NApiVersion  2.1
 * @NScriptType  restlet
 **/


define(['N/record'],
function(record){

	function _get(context){
		if(typeof context.type == 'undefined'){
			return `{"error":"type missing"}`;
		};
		if(typeof context.id == 'undefined'){
			return `{"error":"id missing"}`;
		};
			

		var r = record.load({
			type: context.type,
			id: context.id,
			isDynamic: false
		});
		var invoiceData = r.toJSON();

		return JSON.stringify(invoiceData);
	} // get

	function _post(context){

		if( typeof context.id == 'undefined' ){
			var r = record.create({
				type: context.type,
				isDynamic: context.isDynamic,
			});
		} else{
			var r = record.load({
				type: context.type, 
				id: context.id,
				isDynamic: context.isDynamic,
			});
		}

		if( typeof context.fields != 'undefined' ){
			Object.keys(context.fields).forEach(function(key) {
				r.setValue({
					fieldId: key,
					value: context.fields[key]
				});
			});
		}

		if( typeof context.sublists != 'undefined' ){
			Object.keys(context.sublists).forEach(function(_sublistId) {
				
				context.sublists[_sublistId].forEach( (line,line_index)=>{
					r.selectNewLine({ sublistId: _sublistId });

					Object.keys(line).forEach(function( key ) {

						r.setCurrentSublistValue({
							sublistId: _sublistId,
							fieldId: key,
							value: line[key]
						});

					});
					
					r.commitLine({ sublistId: _sublistId });

				});
				

			});

		}


		r.save();
		return JSON.stringify( r );
	} // post

	function _put(context){

		var r = record.load({
			type: context.type, 
			id: context.id,
			isDynamic: context.isDynamic,
		});

		if( typeof context.fields != 'undefined' ){
			Object.keys(context.fields).forEach(function(key) {
				r.setValue({
					fieldId: key,
					value: context.fields[key]
				});
			});
		}

		if( typeof context.sublists != 'undefined' ){
			Object.keys(context.sublists).forEach(function(_sublistId) {
				
				context.sublists[_sublistId].forEach( (line,line_index)=>{
					r.selectLine({ sublistId: _sublistId , line: line_index });

					Object.keys(line).forEach(function( key ) {

						r.setCurrentSublistValue({
							sublistId: _sublistId,
							fieldId: key,
							value: line[key]
						});

					});
					
					r.commitLine({ sublistId: _sublistId });

				});
				

			});

		}


		r.save();
		return JSON.stringify( r );
	} // put

	function _delete(context){

		if( typeof context.sublist == 'undefined' ){
			var r = record.delete({
				type: context.type,
				id: context.id,
			});

			return JSON.stringify( r );
		}


		var r = record.load({
			type: context.type, 
			id: context.id,
			isDynamic: true,
		});

		r.removeLine({
			sublistId: context.sublist,
			line: context.line
		});

		r.save();
		return JSON.stringify( r );
	} // delete
	 
	 return {
		get: _get,
		post: _post,
		put: _put,
		delete: _delete
	 };


});
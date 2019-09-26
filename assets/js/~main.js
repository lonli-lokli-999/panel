'use strict';

/* modules 
=========================== */


	/* module map
	===========================*/
	const map = 
	{
		get location( )
		{
			return window.location
		},

		get villages() 
		{
			let host = this.location;
			return `${ host.origin }${ host.pathname }?screen=overview_villages`
		},

		villegeBuilds()
		{

		}
	}; 

	/* module calc
	===========================*/
	var calc = 
	{ 
	  	render()
		{
		let calc_box = document.createElement( 'div' );
		
		calc_box.innerHTML = '<h2>Calc</h2><hr><input class="calc_inp" placeholder="Calculate"><span class="resum"></span>';

		calc_box.querySelector( 'input' )
		    .addEventListener( 'input',  calc.resum );
		return calc_box;
		},

		resum()
		{
			let val = document.querySelector( '.calc_inp' ).value; 	
			val != '' ? ( calc.log( eval( val ) ) ) : ( calc.log( '' ) );
		},

		log( val ){
			document.querySelector( '.resum' ).innerHTML = val;
		}
	};

	/* module notes
	===========================*/
	var notes = 
	{
		render()
		{ 
			this.notes_box = document.createElement( 'div' ),
			this.note_list = memory.r( 'notes' ) || [];
			
			this.notes_box.innerHTML = '<h2>Notes module</h2><hr><input placeholder="Write note title"><textarea placeholder="Write note"></textarea><button class="save-note">Save</button><div class="note-list"></div>';

			this.notes_box.querySelector( '.save-note' )
				.addEventListener( 'click', notes.add )
		
			return this.notes_box;
		},

		add() 
		{
			let 
				note_title = notes.notes_box.querySelector( 'input' ),
				note_msg = notes.notes_box.querySelector( 'textarea' );

			notes.note_list.push( { title: note_title.value, msg: note_msg.value, time: `${ getTime( 'yod', '-' ) } ${ getTime( 'hms' ) }` } );
			
		  	memory.w( 'notes', notes.note_list )
			notes.reload()
			note_title.value = note_msg.value = '';
		},

		del()
		{
			let note_id = this.getAttribute( 'data-id' );
			notes.note_list.splice( note_id, note_id +1 );

			memory.w( 'notes',  notes.note_list )
			notes.reload()
		},

		reload()
		{
				let note_list_html = 
					this.note_list.map( function( note, id ) {
						return `<div class="note"><div><h3>${ note.title }</h3><p>${ note.msg }</p><p>${ note.time }</p></div><div class="note__buttons"><button class="del" data-id="${ id }">X</button></div></div>`
					} ) 
						.join( '' );

				this.notes_box.querySelector( '.note-list' ).innerHTML = note_list_html;

				this.notes_box
					.querySelectorAll( '.note-list .del' )
						.forEach( function( btn ){
							btn.addEventListener( 'click', notes.del )					
						} )	
		}
	};

	/* module notes
	===========================*/

	var villages_maneger = 
	{
		render()
		{
			let villages = this.reload();

			let b_villages = document.createElement( 'div' );
				b_villages.classList.add( 'villages' );
				b_villages.innerHTML = `<h2>View villages</h2><hr><div class="villages-list">${this.villages_list_render(villages)}</div>`;

			return b_villages
		},

		villages_list_render( villages )
		{
			return villages
				.map( village => `<div class="village"><a href="${ village.href }">${ village.label }</a>Дерево: ${ village.wood }; Глина:${ village.stone }; Сталь:${ village.iron }</div>` )
					.join( '' );
		},

		reload()
		{
        	let 
				game_villages_links = getPageInBox( './test.html' ), 
				villages = [];

			game_villages_links = game_villages_links.querySelectorAll( '#production_table .nowrap' );
			
			game_villages_links.forEach( function( village )
				{
					
					let village_link = village.querySelector( '.quickedit-content a:not(.rename-icon)' ),
						res_wood = village.querySelector( '.wood' ).innerHTML,
						res_stone = village.querySelector( '.stone' ).innerHTML,
						res_iron = village.querySelector( '.iron' ).innerHTML,
						village_comands = villages_maneger.getCommands( village_link.href );

					villages.push( 
						{
							href: village_link.href,
							label: village_link.innerHTML,
							wood: res_wood,
							stone: res_stone,
							iron: res_iron,
							commands: village_commands
						} 
					)
				}
			);
			
			return villages
		},
		
		getCommands( url )
		{
			let comands_box = getPageInBox( url ).querySelectorAll( '.command-row' ),
				commands_html = 'Hello!';

			return commands_html		
		}
	};


/* panel
=========================== */

var panel = 
{
	render() 
	{
		let
			panel_wrap = document.createElement( 'div' );
				panel_wrap.classList.add( 'panel-wrap' );
					panel_wrap.innerHTML = '<div class="b-panel"></div>';
		document.body.appendChild( panel_wrap );

		this.panel_wrap = panel_wrap;		

		document.addEventListener( 'keydown', function( ev ) {
			if ( ev.shiftKey && ev.code == 'Space' ) {
				ev.preventDefault();
				panel.switched();
			}
		} );


		return this;
	},

	switched()
	{
		this.panel_wrap.classList.toggle( 'panel-wrap--active' )
	},

	add( aplet ) 
	{
		this
			.panel_wrap
				.querySelector( '.b-panel' )
					.appendChild( aplet );
		return this
	}
};

/* memory
=========================== */

var memory = {
	r( key )
	{
		this.createMemory(  );
		let data = JSON.parse( localStorage.getItem( 'panel-data' ) );
		return data[ key ]
	},
	
	w( key, val )
	{
		this.createMemory(  );

		let data = JSON.parse( localStorage.getItem( 'panel-data' ) );	
		data[ key ] = val;

		localStorage.setItem('panel-data', JSON.stringify( data ) )
	},
		
	createMemory()
	{
		if( !localStorage.getItem( 'panel-data' ) ) localStorage.setItem('panel-data', JSON.stringify( {} ) );
	}
}

/* function
=========================== */

function getTime( keys, s )
{
	let time = new Date(),
		out_time = [];
		s = s || ':';

		keys = Array.from( keys );
		keys.forEach( function( key ) 
			{
				key == 's' ?
					( out_time.push( time.getSeconds() ) ) 
				:
				key == 'm' ?
					( out_time.push( time.getMinutes() ) )
				:
				key == 'h' ?
					( out_time.push( time.getHours() ) )
				:
				key == 'd' ?
					( out_time.push( time.getDate() ) )
				:
				key == 'o' ?
					( out_time.push( time.getMonth() ) )
				:
				key == 'y' ?
					( out_time.push( time.getFullYear() ) )
				:
					( false )
				;
			} 
		);

	return out_time
		.map( function( t, index )
			{
				return `${ t }${ index +1 < out_time.length ? s : '' }`
			}
		)
			.join( '' )
};

function requestSync( url )
{
        let request = new XMLHttpRequest();
            request.open('GET', url, false);
            request.send();
        return request.status != 200 ? `${ request.status }: ${ request.statusText }` : request.responseText;  
};

function getPageInBox(page_url, select ) {
    let resBox = document.createElement( 'div' );
        resBox.innerHTML = requestSync( page_url );

	return select ? resBox.querySelector( select ) : resBox;
};

/* run 
=========================== */

(function() {
		panel.render()
			.add( calc.render() )
				.add( villages_maneger.render() )
					.add( notes.render() );
  	notes.reload();
} ( null ));

// ==UserScript==
// @name     add panel
// @version  1
// @grant    none
// ==/UserScript==

'use strict';

/* constants 
===========================*/

const
	__styles = 'file:///home/reader/Templates/panel/assets/css/style.css';

/* modules 
=========================== */

// module calc
//===========================
function calc() { 
  	let
      calc_box = document.createElement( 'div' );
    
    	calc_box.innerHTML = '<h2>Calc</h2><hr><input class="calc_inp" placeholder="write math"><span class="resum"></span>';

    	calc_box.querySelector( 'input' )
        	.addEventListener( 'input',  resum );

	function resum(){
		let val = document.querySelector( '.calc_inp' ).value; 	
		val != '' ? ( log( eval( val ) ) ) : ( log( '' ) );
	};

	function  log( val ){
		document.querySelector( '.resum' ).innerHTML = val;
	};

	return calc_box;
};

// module notes
//===========================
var notes = {
	render(){ 
		this.notes_box = document.createElement( 'div' ),
		this.note_list = JSON.parse( localStorage.getItem('msg') ) || [];
		
		this.notes_box.innerHTML = '<h2>Notes module</h2><hr><input placeholder="Write note title"><textarea placeholder="Write note"></textarea><button class="save-note">Save</button><div class="note-list"></div>';

		this.notes_box.querySelector( '.save-note' )
			.addEventListener( 'click', notes.save )
    
    return this.notes_box;
  },
	save(  ) {
			let 
				note_title = notes.notes_box.querySelector( 'input' ),
				note_msg = notes.notes_box.querySelector( 'textarea' );

			notes.note_list.push( { title: note_title.value, msg: note_msg.value, time: getTime() } );
      localStorage.setItem('msg', JSON.stringify( notes.note_list ) );
      
			notes.reload()

			note_title.value = note_msg.value = '';
	},
	reload(){
			let note_list_html = this.note_list.map( note => `<div class="note"><h3>${ note.title }</h3><p>${ note.msg }</p><p>${ note.time }</p></div>` ).join( '' )
			this.notes_box.querySelector( '.note-list' ).innerHTML = note_list_html;	
	}
};

/* functions 
=========================== */

function add_my_style(){
  let
  styles = document.createElement( 'link' );
  styles.setAttribute( 'rel', 'stylesheet' );
  styles.setAttribute( 'href', __styles );

  document.head.appendChild( styles )
};

function panel_render(){
	let panel = document.createElement( 'div' );
		panel.classList.add( 'panel' );

		panel.add = ( aplet ) => ( panel.appendChild( aplet ) );
	return document.body.appendChild( panel );
};

function getTime(){
	let time = new Date();
	return `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
}

(function(){
	// load script and style
	add_my_style();

	// render html
	let panel = panel_render();
		panel.add( calc() )
		panel.add( notes.render() );
  	notes.reload();
}( null ));

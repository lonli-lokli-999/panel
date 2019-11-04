	'use strict';

/*===========================
	panel
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
		let panel = this.panel_wrap;
		!panel.classList.contains( 'panel-wrap--active' ) ? 
			( wathc.start(), panel.classList.add( 'panel-wrap--active' ) ) :
			( wathc.stop(), panel.classList.remove( 'panel-wrap--active' ) ); 
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

/* modules
=========================== */

var villages_maneger = 
{
	render()
	{
		let villages = this.dataLoad();

		let b_villages = document.createElement( 'div' );
			b_villages.classList.add( 'villages' );
			b_villages.innerHTML = `<h2>Деревни</h2><hr><div class="villages-list">${this.villages_list_render(villages)}</div>`;

		return b_villages
	},

	reload()
	{
		let
			b_villages = document.querySelector( '.b-panel .villages' ),
			b_villages_new =  villages_maneger.render();

			b_villages.innerHTML = b_villages_new.innerHTML;
	},

	villages_list_render( villages )
	{
		return villages
			.map( village => `<div class="village ${ village.id == url_map.idCurrentVillage ? 'village--active' : ''}" ><a href="${ village.href }">${ village.label }</a><div>Дерево: ${ village.wood }; Глина:${ village.stone }; Сталь:${ village.iron }</div><div class="village__builds"> ${ builds.getBuildsInfo(village.id) } </div></div>` )
				.join( '' );
	},

	dataLoad()
	{
    	let 
			game_villages_links = getPageInBox( url_map.villages ), 
			villages = [];

		game_villages_links = game_villages_links.querySelectorAll( '#production_table .nowrap' );
		
		game_villages_links.forEach( function( village )
			{
				
				let village_link = village.querySelector( '.quickedit-content a:not(.rename-icon)' ),
					res_wood = village.querySelector( '.wood' ).innerHTML,
					res_stone = village.querySelector( '.stone' ).innerHTML,
					res_iron = village.querySelector( '.iron' ).innerHTML,
					village_id = village.querySelector( '.quickedit-vn' ).getAttribute( 'data-id' );

				villages.push( 
					{
						href: village_link.href,
						label: village_link.innerHTML,
						wood: res_wood,
						stone: res_stone,
						iron: res_iron,
						id: village_id
					} 
				)
			}
		);
		
		return villages
	}
};

var	builds =
{
	getBuildsInfo( id )
	{
		let 
			builds_html = this.getBuildsHtml( id ),
			builds_info = this.buildsInfoExtract( builds_html );

		return builds_info ? this.render( builds_info ) : '';
	},

	getBuildsHtml( id )
	{
		let
			village_build_page = url_map.villageBuilds( id );

		return getPageInBox( village_build_page ).querySelectorAll( '[class*=" buildorder"]' )
	},

	buildsInfoExtract( builds )
	{
		builds.map = [].map;
		let builds_info = builds.map( function( build )
			{
				return {
					name: build.querySelectorAll( '.lit-item' )[0].innerText,
					time: build.querySelectorAll( '.lit-item' )[1].innerText
				}
			}
		);

		return builds_info
	},
	
	render( builds )
	{
		return builds.map( build => `<span>${ build.name }; Завершение: ${ build.time };</span>` ).join( '' )
	}
};

var bookmarks =
{
	render()
	{
		let 
			b_bookmarks = document.createElement( 'div' ),
			bookmarks_html = `<a href="${ url_map.areaPage }">Площадь</a><a href="${ url_map.villageBuilds() }">Ратуша</a><a href="${ url_map.recruitmentPage }">Набор рекрутов</a><a href="${ url_map.gatheringPage }">Сбор ресурсов</a>`;

		b_bookmarks.classList.add( 'bookmarks' );
		b_bookmarks.innerHTML = bookmarks_html;
		
		return b_bookmarks
	}
}

/* map
===========================*/
const url_map = 
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
	
	get idCurrentVillage()
	{
		let host = this.location.search,
		search_obj = new URLSearchParams( host );

		return search_obj.get( 'village' )
	},

	villageBuilds( id )
	{
		let host = this.location;
		return `${ host.origin }${ host.pathname }?village=${id || this.idCurrentVillage }&screen=main`
	},

	get areaPage()
	{
		let host = this.location;
		return `${ host.origin }${ host.pathname }?village=${ this.idCurrentVillage }&screen=place`
	},

	get recruitmentPage()
	{
		let host = this.location;
		return `${ host.origin }${ host.pathname }?village=${ this.idCurrentVillage }&screen=train`
	},
	
	get gatheringPage()
	{
		let host = this.location;
		return `${ host.origin }${ host.pathname }?village=${ this.idCurrentVillage }&screen=place&mode=scavenge`
	}
};

/* atack maneger
===========================*/

const templ = 
{
	generateTemplBox()
	{
		let templBox = document.createElement( 'div' ),
			list = storage.get( 'templ' );

		list.forEach( function( el ) {
			let btn = document.createElement( 'button' );
				btn.setAttribute( 'data-units', JSON.stringify( el.units ) );
				btn.addEventListener( 'click', templ.use );
				btn.innerHTML = el.name;

			templBox.appendChild( btn )
		} );

		return templBox;
	},

	generateTemplContext(){
		let templContext = document.createElement( 'div' );
			templContext.innerHTML = '<button class="add-templ">Добавить шаблон</button><input type="text" name="templ-name" placeholder="Введите имя нового шаблона">';
			templContext.appendChild( templ.generateTemplBox() );
		
		templContext.querySelector( '.add-templ' )
			.addEventListener( 'click', () => ( templ.add() ) );

		return templContext
	},

	use()
	{
		let units = JSON.parse( this.getAttribute( 'data-units' ) );

			Object.keys(units)
				.forEach( function(key) {
					document.querySelector( `input[name="${key}"]` ).value = units[key]
				} );
	
		removeContext()
	},
	
	add( tmp )
	{
		let list = storage.get( 'templ' ),
			templName = document.querySelector( 'input[name="templ-name"]' ).value || 'Без имени',
			newTempl = {name: templName, units: {} };

		document.querySelectorAll( 'input[id*="unit_input"]' )
			.forEach( function( unit ) {
				let 
					name_unit = unit.name,
					amount_units = unit.value;

				if( amount_units ) newTempl.units[name_unit] = amount_units;	
			} );
		
		list.push( newTempl )
		storage.set( 'templ', list )

		removeContext()
	}	
};

/* Storage maneger
===========================*/

const storage =
{
	get( name )
	{
		if( !localStorage.getItem( name ) ) {
			storage.set( name, [] );
			return []
		};

		return JSON.parse( localStorage.getItem( name ) );
	},

	set( name, val )
	{
		localStorage.setItem( name, JSON.stringify( val ) )
	}
};

/* keyboards function
===========================*/
const keyboard = {
	event( ev ){
		if( document.activeElement.tagName == 'INPUT' ) return;

		let key = ev.key;
		key == 'd' ?
			( keyboard.villageNext() ) :
		key == 'a' ?
			( keyboard.villagePrevious() ) :
		( false );
	},
	villageNext()
	{
		let village = document.querySelector( '.village--active' ),
			village_next = village.nextElementSibling,
			village_next_url = village_next.querySelector( 'a' ).href;
		location.href = village_next_url;
	},

	villagePrevious()
	{
		let village = document.querySelector( '.village--active' ),
			village_previous = village.previousElementSibling,
			village_previous_url = village_previous.querySelector( 'a' ).href;
		location.href = village_previous_url;
	}
};

/* function
=========================== */
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

const wathc = {
	start()
	{
		this.wathcer = setInterval( villages_maneger.reload, 2000 );
	},
	stop()
	{
		clearInterval( this.wathcer	)
	}
};

function newContext( content, x, y )
{
	let
		b_context = document.createElement( 'div' );
		b_context.classList.add( 'b-context' );
		b_context.style.cssText = `top: ${y}px; left: ${x}px`;

		b_context.appendChild( content );
		document.body.appendChild( b_context )
};

function resetContext( content )
{
	let
		b_context = document.createElement( '.b-context' );

	b_context.innerHTML = '';
	b_context.appendChild( content );
};

function removeContext(){
	document.querySelector( '.b-context' ).remove()
};

/* run 
=========================== */

(function() {
		panel.render()
			.add( bookmarks.render() )
			.add( villages_maneger.render() )		
		;

		document.addEventListener( 'keydown', keyboard.event )

		if( document.querySelector('#command-data-form') ){
				document.querySelector('#command-data-form')
					.addEventListener( 'contextmenu', function(ev) {
						ev.preventDefault();
						newContext( templ.generateTemplContext(), ev.pageX, ev.pageY )		
					} );
		};
} ( null ));



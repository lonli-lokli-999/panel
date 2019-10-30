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

/* run 
=========================== */

(function() {
		panel.render()
			.add( bookmarks.render() )
			.add( villages_maneger.render() )		
		;

		document.addEventListener( 'keydown', keyboard.event )
} ( null ));


(function(){let styles = document.createElement( 'style' );styles.innerHTML = ':root {--main-bg: #fff;--main-color: #999;--dbl-bg: #eee;--dbl-color: #977;}.panel-wrap {position: fixed;top: 0;left: 0;background: var( --main-bg );box-shadow: 0 0 .5rem var( --main-color );height: 100%;transition: 500ms;  width: .2rem;  opacity: 0; overflow-x: hidden;overflow-y: auto;  z-index: 12324242;}.panel-wrap:hover,.panel-wrap--active {width: 30rem;opacity: 1;}.b-panel,.b-panel * {border: 0;padding: 0;margin:0;outline: none;font-size: 16px;box-sizing: border-box;color: var( --main-color );}.b-panel h2,.b-panel h3,.b-panel p {  padding: .5rem 1rem;}.b-panel hr {border: .1rem solid var( --main-color );margin: .5rem 0;}.b-panel input,.b-panel textarea,.b-panel button {display: block;width: 100%;background: var( --main-bg );padding: 1rem;margin: .5rem 0;transition: 500ms;}.b-panel input:hover,.b-panel textarea:hover,.b-panel button:hover {background: var( --dbl-bg );}.b-panel a {font-style: italic;transition: 500ms;text-decoration: none;}.b-panel a:hover {color: var( --main-color )}.villages-list {margin: .5rem 0;}.villages-list .village {padding: .5rem;}.villages-list .village--active {border-left: .2rem solid #999;}.villages-list .village:nth-child(even) {background: var( --dbl-bg );}.village__builds span {display: block;padding: .2rem 0;}.bookmarks {padding: .5rem 0;}.bookmarks a {display: inline-block;padding: .5rem;}.bookmarks a:hover {background: var( --dbl-bg );}';document.head.appendChild( styles )}(null))
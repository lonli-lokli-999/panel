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
			b_villages_new =  this.render();

			b_villages.innerHTML = b_villages_new.innerHTML;
	},

	villages_list_render( villages )
	{
		return villages
			.map( village => `<div class="village" ><a href="${ village.href }">${ village.label }</a><div>Дерево: ${ village.wood }; Глина:${ village.stone }; Сталь:${ village.iron }</div><div class="village__builds"> ${ builds.getBuildsInfo(village.id) } </div</div>` )
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
			bookmarks_html = `<a href="${ url_map.areaPage }">Площадь</a><a href="${ url_map.villageBuilds() }">Ратуша</a><a href="${ url_map.recruitmentPage }">Набор рекрутов</a>`;

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
		let host = this.location,
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

function watcher()
{
	villages_maneger.reload()	
};

/* run 
=========================== */

(function() {
		panel.render()
			.add( bookmarks.render() )
			.add( villages_maneger.render() )		
		; 

		setInterval( watcher, 3000 )
} ( null ));



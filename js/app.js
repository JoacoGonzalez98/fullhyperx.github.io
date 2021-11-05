// Selectores
const listaProductos = document.querySelector("#lista-productos");


$.ajax({
	url: './js/productos.json',
	success: function (productosJSON, textStatus, xhr) {
		let productos = productosJSON;
		renderProducts(productos);
	},
	error: function (xhr, textStatus, error) {
		console.log(xhr);
		console.log(textStatus);
		console.log(error);
	}
});





function renderProducts(producto) {
	producto.forEach((elemento) => {
		const card = document.createElement("div");
		const cardContent = `
				<img src="${elemento.imagen}" class="imagen-${elemento} imagen-prod" id="${elemento}">
				<div class="info-card">
				<h4>${elemento.nombre}</h4>
				<p>HyperX</p>
				<p class="precio">$<span class="u-pull-right">${elemento.precio}</span></p>
				<a href="#" id="button-event" class="u-full-width button-primary button input agregar-carrito" data-id="${elemento.id}">Agregar al Carrito</a>
				</div>`;
		card.classList.add("card");
		card.classList.add("container");
		card.innerHTML = cardContent;
		listaProductos.appendChild(card);
	});
}
// se crea carrito vacio si en localStorage no hay nada
let carrito = JSON.parse(localStorage.getItem(0)) || []

listaProductos.addEventListener('click', agregarProducto);

function agregarProducto(e) {
	e.preventDefault();
	if (e.target.classList.contains("agregar-carrito")) {
		const productCard = e.target.parentElement.parentElement;

		const productoAgregado = {
			imagen: productCard.querySelector('img').src,
			nombre: productCard.querySelector('h4').textContent,
			precio: productCard.querySelector('.precio span').textContent,
			cantidad: 1,
			id: productCard.querySelector('a').dataset.id
		}

		// chequeo con some si el producto ya existe, comparando con id
		const existe = carrito.some(e => e.id == productoAgregado.id)


		if (existe) {
			carrito.forEach(e => {
				// si el producto ya esta en el carrito, le aumento la cantidad
				if (e.id == productoAgregado.id) {
					e.cantidad = e.cantidad + 1
				}
			})
		} else {
			// pusheo producto al carrito
			carrito.push(productoAgregado)
		}

		// actualizo localStorage
		localStorage.setItem(0, JSON.stringify(carrito))

		//Renderizo la tabla con los items del carrito
		actualizarCarritoHTML();


	}
}

function actualizarCarritoHTML() {
	const tableCarrito = document.querySelector("#lista-carrito")
	//para que no se repita en el carrito
	tableCarrito.innerHTML = '';
	carrito.forEach(producto => {
		const { imagen, nombre, precio, cantidad, id } = producto;
		const row = document.createElement('tr');
		row.innerHTML = `
			<td class="text-center">
				<img class="imagen-carrito" src="${imagen}" width="100%">
			</td>
			<td class="text-center">
				${nombre}
			</td>
			<td class="text-center">
				$ ${precio}
			</td>
			<td class="text-center">
				${cantidad}
			</td>
			<td class="text-center">
				<a href="#" class="borrar-producto fas fa-trash-alt" data-id="${id}"></a>
			</td>
		`
		tableCarrito.appendChild(row);
	});

	$(".borrar-producto").click(function (e) {
		e.preventDefault()
		const id = e.target.dataset.id
		const index = carrito.findIndex(prod => prod.id == id)
		// uso splice para eliminar producto del carrito
		carrito.splice(index, 1)
		actualizarCarritoHTML()
		actualizarLocalStorage()
	})
}

function actualizarLocalStorage() {
	localStorage.setItem(0, JSON.stringify(carrito))
}

$(".submenu").click(function (e) {
	e.preventDefault()
	if (e.target.id == "img-carrito") {
		$("#carrito").fadeIn()
	}
	if (e.target.classList.contains("cerrar")) {
		$("#carrito").fadeOut()
	}
})

$(document).ready(function () {
	actualizarCarritoHTML()
})


function vaciarCarrito() {
	carrito = []
	actualizarCarritoHTML()
	actualizarLocalStorage()
}

function comprarProductos() {
    // si el carrito esta vacio...
    if (!carrito.length) {
        return swal("Error", `El carrito está vacio!`, "error");
    }
    let gastoTotal = 0
    let productosTotal = 0
    if (carrito.length === 1) {
        gastoTotal = carrito[0].precio * carrito[0].cantidad
        productosTotal = carrito[0].cantidad
    }
    if(carrito.length > 1){
        carrito.forEach(prod => {
            gastoTotal = Number(prod.precio) + gastoTotal
            productosTotal = Number(prod.cantidad) + productosTotal
        })
    }
    swal("Listo!", `Tu compra es de $${gastoTotal}, compraste ${productosTotal} productos.`, "success");
    vaciarCarrito()
}

$("#vaciar-carrito").click(function (e) {
	e.preventDefault();
	vaciarCarrito()
});

$("#comprar-productos").click(function () {
	comprarProductos()
})

const typed = new Typed('.typed', {
	strings: [
		'<i class="perifericos">Auriculares</i>',
		'<i class="perifericos">Micrófonos</i>',
		'<i class="perifericos">Teclados</i>',
		'<i class="perifericos">Ratones</i>',
		'<i class="perifericos">Alfombrillas</i>'
	],

	//stringsElement: '#cadenas-texto', // ID del elemento que contiene cadenas de texto a mostrar.
	typeSpeed: 75, // Velocidad en mlisegundos para poner una letra,
	startDelay: 300, // Tiempo de retraso en iniciar la animacion. Aplica tambien cuando termina y vuelve a iniciar,
	backSpeed: 75, // Velocidad en milisegundos para borrrar una letra,
	smartBackspace: true, // Eliminar solamente las palabras que sean nuevas en una cadena de texto.
	shuffle: false, // Alterar el orden en el que escribe las palabras.
	backDelay: 1500, // Tiempo de espera despues de que termina de escribir una palabra.
	loop: true, // Repetir el array de strings
	loopCount: false, // Cantidad de veces a repetir el array.  false = infinite
	showCursor: true, // Mostrar cursor palpitanto
	cursorChar: '|', // Caracter para el cursor
	contentType: 'html', // 'html' o 'null' para texto sin formato
});



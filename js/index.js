

// Variables y selectores
const formulario=document.getElementById("agregar-gasto");
const gastoListado=document.querySelector("#gastos ul");



//Eventos

eventListeners();
function eventListeners(){
    document.addEventListener(`DOMContentLoaded`, preguntarPresupuesto);

    //agrego un evenyo al formulario para validarlo
    formulario.addEventListener(`submit`, agregarGasto);
}



// Clases

class Presupuesto{
    constructor(presupuesto){
        //aqui ponemos lo que nos hace falta para calcular el presupuesto 
        this.presupuesto=Number(presupuesto);
        this.restante=Number(presupuesto);
        this.gastos=[]; 
    }
    nuevoGasto(gasto){
        this.gastos=[...this.gastos, gasto];
        this.calcularRestante();
    }
    calcularRestante(){
        const gastado=this.gastos.reduce((total, gasto)=> total + gasto.cantidad, 0);
        this.restante= this.presupuesto - gastado;
    }
    eliminarGasto(id){
        this.gastos= this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }

   
}

class UI{
    insertarPresupuesto(cantidad){
        //extraigo el valor
        const {presupuesto, restante}=cantidad;
        //lo inserto en el html
        document.querySelector(`#total`).textContent=presupuesto;
        document.querySelector(`#restante`).textContent=restante;
    }

    imprimirAlerta(mensaje, tipo){
        //Crear el div mensaje
        const divMensaje= document.createElement(`div`);
        divMensaje.classList.add(`text-center`, `alert`);
        
        if(tipo=== `error`){
            divMensaje.classList.add(`alert-danger`);
        }else{
            divMensaje.classList.add(`alert-success`);
        }

        //mensaje de error
        divMensaje.textContent=mensaje;
        //Insertar en el HTML
        document.querySelector(`.primario`).insertBefore(divMensaje, formulario); 
        //parametros de insertBefore uno es que vamos a insertar y el segundo es donde lo vamos a insertar

        //quitarlo del html
        setTimeout(() => {
            document.querySelector(`.primario .alert`).remove();
        }, 3000);
    }
    mostrarGastos(gastos){

        this.limpiarHTML(); // Elimina el HTML previo
        
        //Iterar sobre los gastos
        gastos.forEach(gasto => {
            const {cantidad, nombre,id}=gasto;
            //Creo un LI
            const nuevoGasto= document.createElement(`li`);
            nuevoGasto.className= `list-group-item d-flex justify-content-between align-items-center`;
            nuevoGasto.setAttribute(`data-id`, id);

            //Agregar el HTML del gasto
            nuevoGasto.innerHTML= `${nombre} <span class="badge badge-primary badge-pill">€ ${cantidad}</span>`;

            //Boton para agregar el gasto
            const btnBorrar= document.createElement(`button`);
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.textContent = 'Borrar';
            btnBorrar.onclick=()=>{
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //Agregamos al HTML
            gastoListado.appendChild(nuevoGasto);
        });
    }

    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }
    actualizarRestante(restante){
        document.querySelector(`#restante`).textContent=restante;
    }
    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante}=presupuestoObj;
        const restanteDiv=document.querySelector(`.restante`);

        //Comprobar el 25%
        if((presupuesto/4)>restante){
            restanteDiv.classList.remove(`alert-success`, `alert-warning`);
            restanteDiv.classList.add(`alert-danger`);
        }else if((presupuesto/2)>restante){
            restanteDiv.classList.remove(`alert-success`);
            restanteDiv.classList.add(`alert-warning`);
        }else{
            restanteDiv.classList.remove(`alert-danger`, `alert-warning`);
            restanteDiv.classList.add(`alert-success`);
        }

        //Si el total es 0 o menor
        if(restante<=0){
            ui.imprimirAlerta(`El presupuesto se ha agotado`, `error`);
            formulario.querySelector(`button[type="submit"]`).disabled=true;
        }
    }

}


//Instanciar en la ventana global para usar en otras partes
const ui=new UI();
let presupuesto;


//Funciones

function preguntarPresupuesto(){
    const presupuestoUsuario=prompt(`¿Cual es tu presupuesto? `);
    /* si no escribimos nada y le damos aceptar o si le damos a 
    cancelar la pagina o si escribimos algo que no es un numero se tiene que volver a recargar la pagina hasta que le 
    pongas algo valido o si el presupuesto usuario es menor o igual a 0 */
    if(presupuestoUsuario===``|| presupuestoUsuario=== null || isNaN(presupuestoUsuario)|| presupuestoUsuario<=0){
        window.location.reload(); 
    }

    //presupuesto validado 
    presupuesto=new Presupuesto(presupuestoUsuario);
    

    ui.insertarPresupuesto(presupuesto);
}

//Añadir Gastos

function agregarGasto(e){
    e.preventDefault();

    //Leer los datos del formulario
    const nombre=document.querySelector(`#gasto`).value;
    const cantidad=Number(document.querySelector(`#cantidad`).value);

    //Comprobar que los campos no esten vacios 
    if(nombre === `` || cantidad === ``){
        ui.imprimirAlerta(`Ambos campos son obligatorios`, `Error`);
    }else if(cantidad <= 0 || isNaN(cantidad)){
        //si hay una cantidad negativa o letras 
        ui.imprimirAlerta(`Cantidad no válida`, `error`);
    }else{

    //Generar un objeto con el gasto
    const gasto={nombre, cantidad, id: Date.now()};
    
    //Añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    ui.imprimirAlerta(`Gasto agregado correctamente`);

    //Imprimir los gastos
    const {gastos, restante}=presupuesto;
    
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

    //Reinicia el formulario
    formulario.reset();

    }
}
function eliminarGasto(id){
    //Los elimina del objeto
    presupuesto.eliminarGasto(id)
    //Elimina los gastos del HTML
    const {gastos, restante}= presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}

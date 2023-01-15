const tasks = []; //Arreglo en el cual se van a almacener y trabajar las tareas a mostar

let time = 0;           //Tiempo a transcurrir
let timer = null;       //El temporizador que va corriendo
let timerBreak = null;  //Descanso entre tiempo transcurrido
let current = null;     //Tarea que se está realizando en el momento



const addButton = document.getElementById("inputTask__add");
const task = document.getElementById("inputTask__newTask");
const form = document.getElementById("form");
const taskName = document.querySelector("#timer__content #timer__content-taskName")


        renderTime();
        renderNewTasks();
// Funciones para interacción de crear una nueva tarea


form.addEventListener("submit",(e)=>{
        e.preventDefault();
    //Esto se utiliza para evitar que se envíe las cosas antes
        if(task.value !== ""){
            createNewTask(task.value);
            renderNewTasks();
        }

});

function createNewTask(value) {
    const newTask = {
        id: (Math.random() * 100).toString(10).slice(3),
        title: value,
        completed: false
    };
    tasks.unshift(newTask);
}

function renderNewTasks(){
    const html = tasks.map(task=>{      
        //map siempre debe returnar un nuevo valor
            return`
                <div class="task">
                    <div class="completed">${task.completed ? `<span class="done">Done</span>` : `<button class="start-button" data-id="${task.id}">Iniciar</button>`}</div>
                    <div class="title">${task.title}</div>
                </div>
            `;                         
                
    });
    const tasksContainer = document.getElementById("inputTask__tasks");
    tasksContainer.innerHTML = html.join("");   //el método join convierte todo lo que trae el mapeo en un string

    //Asegura que funcione para cada botón que se haya podido crear con N cantidad de tareas
    const startButtons = document.querySelectorAll(".task .start-button")

    startButtons.forEach(button =>{
        button.addEventListener("click",e =>{
            if(!timer){
                const id = button.getAttribute("data-id");
                startButtonHandler(id)
                button.textContent = 'En progreso...'
            }
        })
    })
}

// Funciones del temporizador

//Dará inicio a todo el circuito de la actividad desde su inicio hasta que termina


function findTaskIndex(id) {
    const taskIndex = tasks.findIndex(task => task.id == id);  //Aquí se extrae el ID de la tarea que se está realizando actualmente.
   return taskIndex
}
function startButtonHandler(id) {
    time = ((25 * 60) + 1);
    current = id;
    taskName.textContent = tasks[findTaskIndex(id)].title;

    timer = setInterval(()=>{                                 // Esto permitirá la actualización por segundo del timer asociado a la actividad actual.
        timeHandler(id)
        
    },1000)
}

function timeHandler(id) {
    time--;
    renderTime();                                           //Función orientada unicamente a renderizar el temporizador en pantalla.

    if(time == 0){
        clearInterval(timer);
        markCompleted(id)                                 //Cambia el estado de la propiedad COMPLETED de la tarea actual a TRUE en el array
        timer = null;
        renderNewTasks();
        startBreak();
    }
}

function renderTime() {
    const timeDiv = document.querySelector("#timer__content #timer__content-counter")
        let minutes = parseInt(time / 60);
        let seconds = parseInt(time % 60);

        timeDiv.textContent = `${minutes < 10 ? '0': ''}${minutes} : ${seconds< 10 ? '0': ''}${seconds}`;

}

function markCompleted(id) {
    tasks[findTaskIndex(id)].completed = true;
}

function startBreak(){
    time = ((5 * 60) + 1);
    taskName.textContent = "Break";
    timerBreak = setInterval(()=>{
        timerBreakHandler();
    },1000);

}

function timerBreakHandler() {
    time--;
    renderTime();                                           //Función orientada unicamente a renderizar el temporizador en pantalla.

    if(time ==  0){
        clearInterval(timerBreak);                      
        current = null;
        taskName.textContent = "";
        renderNewTasks();
    }
}

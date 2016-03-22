//status
//normal mode completed
//hard mode not completed
//pro mode completed

$(document).ready(function(){
    $('#todoForm').on('submit', handleSubmit);
    $('.active').on('click', '.markComplete', markComplete);
    $('.container').on('click', '.delete', deleteTask);
    getTodo();
});

function handleSubmit(event){
    event.preventDefault();

    var values = {};

    $.each($("#todoForm").serializeArray(), function(i, field){
            values[field.name] = field.value;
    });

    $('#todoForm').find('input[type=text]').val('');

    console.log('form data', values);
    sendToServer(values);
}

function sendToServer(todoData){
    $.ajax({
        type: 'POST',
        url: '/todo',
        data: todoData,
        success: serverResponse
    });
}

function serverResponse(response){
    console.log('server response', response);
    getTodo(response);
}

function getTodo(){
    $.ajax({
        type: 'GET',
        url: '/todo',
        success: todoInitial
    });
}

function todoInitial(response){
    console.log('get initial', response);
    appendDom(response);
}

function appendDom(todo){
    // console.log(todo);
    $('.active').empty();
    $('.completed').empty();
    for(var i = 0; i < todo.length; i++){
        if(todo[i].completed == false){
            $('.active').append('<div class="todo"></div>');

            todo[i].completed = 'Not Completed';
            var $el = $('.active').children().last();

        } else if(todo[i].completed == true) {
            $('.completed').append('<div class="todo"></div>');

            todo[i].completed = 'Completed';
            var $el = $('.completed').children().last();
        }

        $el.append('<h3>' + todo[i].task + '</h3>');
        $el.append('<p>' + todo[i].completed + '</p>');

        $el.append('<button class="markComplete">Mark Complete</button>');
        $el.append('<button class="delete">Delete Task</button>');

        $el.data('id', todo[i].id);
        $el.data('task', todo[i].task);
    }
}

function deleteTask(){
    // console.log('delete works');
    var deleteData = {};
    deleteData.id = $(this).parent().data('id');
    $(this).parent().remove();
    $.ajax({
        type: 'DELETE',
        url: '/todo',
        data: deleteData,
        success: taskDeleted
    });
}

function taskDeleted(){
    console.log('delete works');
}

function markComplete(){
    console.log('mark complete works');
    var updateData = {};
    updateData.id = $(this).parent().data('id');
    updateData.task = $(this).parent().data('task');
    updateData.completed = true;
    $(this).parent().remove();
    $.ajax({
        type: 'PUT',
        url: '/todo',
        data: updateData,
        success: taskUpdated
    });
}

function taskUpdated(response){
    console.log('update works', response);
    getTodo(response);
}

console.log('connected');

const baseUrl = 'http://localhost:8000/api/v1/';

function getFullPath(path) {
    path = path.replace(/^\/+|\/+$/g, '');
    path = path.replace(/\/{2,}/g, '/');
    return baseUrl + path + '/';
}

function makeRequest(path, method, auth=true, data=null) {
    let settings = {
        url: getFullPath(path),
        method: method,
        dataType: 'json'
    };
    if (data) {
        settings['data'] = JSON.stringify(data);
        settings['contentType'] = 'application/json';
    }
    if (auth) {
        settings.headers = {'X-CSRFToken': getToken()};
    }
    return $.ajax(settings);
}



function getToken(name='csrftoken') {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;

}
let createCommentForm,formModal, CommentId, editCommentForm,formCreateSubmit,formTitle, formEditSubmit, editTextInput, createTextInput, commentBlock;
function setUpGlobalVars(){
    createCommentForm = $('#comment_create');
    createTextInput = $('#comment_text_create');
    commentBlock = $('#comments');
    formCreateSubmit = $('#CreateFormSubmit');
    editCommentForm = $('#edit_form');
    editTextInput = $('#edit_input_text');
    formEditSubmit = $('#form_edit_submit');
    formTitle = $('#form_title');
    formModal = $('#form_modal');


}
function addError(form){
    if (form.children('.errors').length<=0){
        form.prepend(`<div class="errors">
            <p class="text-danger">You tried to enter empty text! Enter something to this input!</p>
</div>`)
    }
}
function deleteError(){
    $(".errors").remove();
}
function editComment(id, text){
    let credentials = {text};
    let request = makeRequest('comment/'+id, 'patch', auth=true, credentials);
    request.done(function (data, status, response) {
        console.log(data);
        $(`#comment_text_${id}`).text(data.text);
        formModal.modal("hide");
    }).fail(function(response,status,message){
        console.log(response);
    })
}
function createComment(text, photo){
    let credentials = {text, photo};
    let request = makeRequest('comment', 'post', true, credentials);
    request.done(function(data, status, response){
        commentBlock.prepend($(`
            <div class="comment border-dark" id="comment_${data.id}">
            <h4>Комментарий от пользователя ${data.author}</h4>
            <p>${data.text}</p>
            <p>Дата создания: ${data.created_at }</p>
            <a href="" class="btn btn-danger" id="delete_comment_${ data.id }">Удалить комментарий</a>
                <a href="" class="btn btn-info" id="update_comment_${ data.id }">Изменить комментарий</a>
            </div>`));

          $(`#delete_comment_${data.id}`).on('click', function(event){
                event.preventDefault();
                deleteComment(data.id);
            });
          deleteError();
        createTextInput.val("");
    }).fail(function (response, status, message) {
        console.log(response.responseText);
        addError(createCommentForm);
    })
}
function deleteComment(id){
    let request = makeRequest('comment/' + id, 'delete', true, )
    request.done(function(data,status,response){
        $(`#comment_${id}`).remove();
        console.log("deleted");
    }).fail(function(response, status, message){
        console.log(response.responseText.text);

    })
}
function showForm(text){
    $("#edit_form").removeClass("d-none");
    editTextInput.text(text);
    formTitle.text("Изменить");
    formEditSubmit.text("Изменить");
     formEditSubmit.off('click');
        formEditSubmit.on('click', function(event) {
            event.preventDefault();
            editCommentForm.submit();
        });
}
function likePhoto(id){
    let request = makeRequest('like/' + id, 'patch', true,);
    request.done(function(data,status,response){
        console.log(response.responseText);
        $("#rating").text("Рейтинг: "+ data.likes)


    }).fail(function(response, status, message){
        console.log(response.responseText);
    })
}
function dislikePhoto(id){
    let request = makeRequest('dislike/' + id, 'patch', true,);
    request.done(function(data,status,response){
        console.log(data);
        $("#rating").text("Рейтинг: "+ data.likes)

    }).fail(function(response, status, message){
        console.log(response.responseText);
    })
}
function setUpButtons(){
    editCommentForm.on('submit', function (event) {
        event.preventDefault();
        editComment(CommentId, editTextInput.val())
    });
    createCommentForm.on('submit', function(event){
        event.preventDefault();
        createComment(createTextInput.val(), photoId);
    });
    formCreateSubmit.off('click');
    formCreateSubmit.on('click', function (event) {
            event.preventDefault();
            createCommentForm.submit();
    })
}


function checkIfLiked(id) {

    let request = makeRequest('can_like/'+id, 'get', true);
    request.done(function(){
        $("#like_btn").addClass("d-none");
        $("#dislike_btn").removeClass("d-none");
    }).fail(function () {
        $("#dislike_btn").addClass("d-none");
        $("#like_btn").removeClass("d-none");
    });
}

$(document).ready(function() {
    setUpGlobalVars();
    setUpButtons();
});


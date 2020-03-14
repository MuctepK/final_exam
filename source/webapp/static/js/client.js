const baseUrl = 'http://localhost:8000/';

function getFullPath(path) {
    path = path.replace(/^\/+|\/+$/g, '');
    path = path.replace(/\/{2,}/g, '/');
    return baseUrl + path + '/';
}

function makeRequest(path, method, auth=true, data=null) {
    let settings = {
        url: getFullPath(path),
        method: method,
    };
    if (data) {
        settings['data'] = data;
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
let grantAccessForm, username, fileId, grantAccessButton, userBlock, profileLink;
function setUpGlobalVars(){
    grantAccessForm = $('#grant_access');
    username = $('#username');
    grantAccessButton = $('#grant_access_button');
    userBlock = $('#user-block');


}
function addError(form, type){
    let text;
    if (type === 1)
        text = "Указанного пользователя не существует!";
    else
        text = "У пользователя уже есть доступ!";
        if (form.children('.errors').length <= 0) {
            form.prepend(`<div class="errors text-center">
            <p class="text-danger">${text}</p>
</div>`)
        }

}
function addSuccess(form, type) {
    let text;
    if (type === 1)
        text = 'Пользователь успешно добавлен';
    if (form.children('.success').length <= 0) {
        form.prepend(`<div class="success text-center">
            <p class="text-success">${text}</p>
</div>`)
    }
}
function deleteError(){
    $(".errors").remove();
}
function deleteSuccess(){
    $(".success").remove();
}

function grantAccess(name, id){

    let credentials = {name, id};
    console.log(credentials);
    let request = makeRequest('grant_access', 'post', true, credentials);
    request.done(function(data, status, response){
        username = JSON.parse(response.responseText).username;
        id = JSON.parse(response.responseText).id;
        profileLink = `http://localhost:8000/${id}/profile/`
        userBlock.append($(`
          <h3 class="text-center">
                <a href="${profileLink}"> ${username}</a>
                <a href="" class="btn btn-danger ml-3">Удалить</a>
            </h3>`));
        addSuccess(grantAccessForm, 1);

        //   $(`#delete_comment_${data.id}`).on('click', function(event){
        //         event.preventDefault();
        //         deleteComment(data.id);
        //     });
        //   deleteError();
        // createTextInput.val("");
    }).fail(function (response, status, message) {
        text = JSON.parse(response.responseText).error;
        if (text === 'Does Not Exist')
            addError(grantAccessForm, 1);
        else if (text === 'Grant Exists')
            addError(grantAccessForm, 2);

    })
}
function deleteComment(id){
    let request = makeRequest('comment/' + id, 'delete', true,);
    request.done(function(data,status,response){
        $(`#comment_${id}`).remove();
        console.log("deleted");
    }).fail(function(response, status, message){
        console.log(response.responseText.text);

    })
}

function setUpButtons(){
    grantAccessForm.on('submit', function (event) {
        event.preventDefault();
        deleteError();
        deleteSuccess();
        grantAccess(username.val(), fileId)
    });
}



$(document).ready(function() {
    setUpGlobalVars();
    setUpButtons();
});


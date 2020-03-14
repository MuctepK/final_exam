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
    else
        text = 'Пользователь успешно удалён';
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
    let request = makeRequest(fileId+'/grant_access/', 'post', true, credentials);
    request.done(function(data, status, response){
        userName = JSON.parse(response.responseText).username;
        id = JSON.parse(response.responseText).id;
        profileLink = `http://localhost:8000/${id}/profile/`;
        userBlock.append($(`
         <div id="single_user_${id}">
          <h3 class="text-center">
                <a href="${profileLink}"> ${userName}</a>
                <a href="#" id="user_delete_${id}" class="btn btn-danger ml-3">Удалить</a>
            </h3>
            </div>`));

        $(`#user_delete_`+id).on('click', function(event){
                        event.preventDefault();
                        deleteAccess(id);
                    });

        addSuccess(grantAccessForm, 1);
        username.val("");
    }).fail(function (response, status, message) {
        text = JSON.parse(response.responseText).error;
        if (text === 'Does Not Exist')
            addError(grantAccessForm, 1);
        else if (text === 'Grant Exists')
            addError(grantAccessForm, 2);
        username.val("");
    })
}
function deleteAccess(userId){
        deleteError();
        deleteSuccess();
    let credentials = {userId};
    console.log(credentials);
    let request = makeRequest(fileId+'/delete_access/', 'post', true, credentials);
    request.done(function(data,status,response){
        $(`#single_user_${userId}`).remove();
        addSuccess(grantAccessForm, 2);
    }).fail(function(response, status, message){
        console.log(response.responseText);
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


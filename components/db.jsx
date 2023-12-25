import axios from 'axios';

let devMode = false;
let baseUrl, tokenUrl;

if (devMode) {
  baseUrl = "http://10.0.2.2:8000/api/v1/";
  tokenUrl = "http://10.0.2.2:8000/token";

  axios.interceptors.request.use(request => {
    console.log('Starting Request', JSON.stringify(request, null, 2))
    return request
  })
  
  axios.interceptors.response.use(response => {
    console.log('Response:', JSON.stringify(response, null, 2))
    return response
  })
} else {
  baseUrl = "https://truedoapi-1-u8581356.deta.app/api/v1/";
  tokenUrl = "https://truedoapi-1-u8581356.deta.app/token";
}




//  -----
//. Todos
//  -----
async function addTodo(token, todo) {
  try {
    let response = await axios.post(baseUrl + "todo/add", 
    {"todo_item": todo},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return [true, response.data];
  } catch (e) {
    return [false, e];
  }
}

async function getTodos(token) {
  try {
    let response = await axios.get(baseUrl + "todo/list", 
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return [true, response.data];
  } catch (e) {
    return [false, e];
  }
}

async function deleteTodo(id, token) {
  try {
    let response = await axios.delete(baseUrl + "todo/delete/" + id, 
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return [true, response.data];
  } catch (e) {
    return [false, e];
  } 
}

async function changeTodo(id, label, token) {
  try {
    let response = await axios.patch(baseUrl + "todo/edit/" + id, 
      {todo_item: label}, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return [true, response.data];
  } catch (e) {
    return [false, e];
  } 
}

// -----
// Notes
// -----
async function getNotes(token) {
  try {
    let response = await axios.get(baseUrl + "notes/list", 
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return [true, response.data];
  } catch (e) {
    return [false, e];
  }
}

async function getSpecificNote(token, id) {
  try {
    let response = await axios.get(baseUrl + "notes/get/" + id, 
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return [true, response.data];
  } catch (e) {
    return [false, e];
  }
}

async function deleteNote(token, id) {
  try {
    let response = await axios.delete(baseUrl + "notes/delete/" + id, 
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return [true, response.data];
  } catch (e) {
    return [false, e];
  } 
}

async function addNote(token, title, content) {
  try {
    let response = await axios.post(baseUrl + "notes/add/", 
    {"title": title, "content": content},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return [true, response.data];
  } catch (e) {
    console.log(e)

    return [false, e];
  }
}

async function changeNote(token, id, title, content) {
  try {
    let response = await axios.patch(baseUrl + "notes/edit/" + id, 
    {"title": title, "content": content},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return [true, response.data];
  } catch (e) {
    return [false, e];
  }
}

// --------
// Calendar
// --------
async function getCalendar(token) {
  try {
    let response = await axios.get(baseUrl + "calendar/list", 
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return [true, response.data];
  } catch (e) {
    return [false, e];
  }
}

async function addCalendar(token, item, date) {
  try {
    let response = await axios.post(baseUrl + "calendar/add/", 
    {"item": item, "date": date},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return [true, response.data];
  } catch (e) {
    console.log(e)

    return [false, e];
  }
}

async function deleteCalendar(token, id, date) {
  try {
    let response = await axios.post(baseUrl + "calendar/delete/", 
    {"id": id, "date": date},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return [true, response.data];
  } catch (e) {
    console.log(e)

    return [false, e];
  }
}

// ----
// Auth
// ----
async function login({username, password}) {
  let formData = new FormData()
  formData.append("username", username);
  formData.append("password", password);
  // let response = await axios.get("https://picsum.photos/200/300");
  // console.log(response);
  
  try {
    let response = await axios.post(tokenUrl, formData, {
      headers: {'Content-Type': 'multipart/form-data'}
    });
    return [true, response.data.access_token];
  } catch (e) {
    return [false, e.message];
  }
}

async function register(details) {
  details.signInMethod = "email";
  try {
    let response = await axios.post(baseUrl + "user/add", details);
    return [true, response];
  } catch (e) {
    return [false, e];
  }
}

function isMobile() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

export { 
  addTodo, getTodos, deleteTodo, changeTodo, 
  getNotes, getSpecificNote, deleteNote, changeNote, addNote,
  getCalendar, addCalendar, deleteCalendar,
  login, register, isMobile }
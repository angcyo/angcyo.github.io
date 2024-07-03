/**
 * Email:angcyo@126.com
 * @author angcyo
 * @date 2021/12/28
 */

//https://api.jquery.com/jQuery.ajax/

//base64编码
//console.log(btoa("Message"));
//base64解码
//console.log(atob("TWVzc2FnZQ=="));

const api = atob('aHR0cHM6Ly9naXRlZS5jb20vYXBpL3Y1L2dpc3RzLzZqY3JpNzB0b2h3cHpuMzhteWd4YjM0')
const ak = atob('Y2FjOGMzMGQzNTg3NDE3NTcyMmU1NzVkNGRlNDYzZjk=')
const targetJson = "statistics.json"

/*$(document).ready(function () {

})*/

$.ajax({
  url: api + "?access_token=" + ak
}).done(function (data) {
  const content = JSON.parse(data.files[targetJson].content)
  $("#pv").text(content.pv + 1)

  $.ajax({
    url: api,
    method: 'PATCH',
    data: {
      "access_token": ak,
      "files": {
        [targetJson]: {
          "content": JSON.stringify({
            "pv": content.pv + 1
          })
        }
      }
    }
  })
})

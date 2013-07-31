var socket;

//日付を獲得する
function timeGet(){
	DD = new Date();
	Year = DD.getYear();
	Month = DD.getMonth();
	Day = DD.getDate();
	Hours = DD.getHours();
	 if (Hours < 10) {Hours = "0" + Hours;}
	Minutes = DD.getMinutes();
	 if (Minutes < 10) {Minutes = "0" + Minutes;}
	Seconds = DD.getSeconds();
	 if (Seconds < 10) {Seconds = "0" + Seconds;}
	days = (Year+1900)+"-"+(Month+1)+"-"+Day+" "+Hours+":"+Minutes+":"+Seconds;
}

$(function() {
  //connectボタンがクリックされたらする処理
  // ボタンクリックは1度だけ有効
  $('#connect').one('click',
    function(e) {
    socket = io.connect('http://10.1.1.57:4445');
		socket.on('connect', function(){ 
			 console.log('connected');
			 name = $('#name').val();
			 timeGet();
		    var arr = {"name":name, "days":days, "key":"con"};
		    var JsonStr = JSON.stringify(arr);
		    socket.send(JsonStr);
		});
	socket.on('message', function(msg) {
	    var jObj = JSON.parse(msg);
	    if(jObj.key == "con"){
		var conMsg = '<div class="field">' + es(jObj.name) + 'さんが接続しました．<span class="timeTxt">(' + es(jObj.days) +')</span><br></div><br>';
		console.log(conMsg);
   		$('#table').append(conMsg);
	    }else if(jObj.key == "send"){
		var sndMsg = '<div class="field">' + es(jObj.name) +'<span class="timeTxt"> ('+ es(jObj.days) +')</span><br>&gt;'+ es(jObj.inMsg) + '</div><br>';
		console.log(sndMsg);
		$('#table').append(sndMsg);
	    }else if(jObj.key == "disCon"){
		var disConMsg = '<div class="field">' + es(jObj.name) + 'さんが切断しました．<span class="timeTxt"> ('+ es(jObj.days) +')</span><br></div><br>';
		socket.disconnect();
                console.log(disConMsg);
                $('#table').append(disConMsg);
	    }
   	});
   	    //名前を変更できないようにする
    document.frmSample.txtName.disabled = true ;
    }
   );

//Sendボタンがクリックされたらする処理
    $('#send').click(function(){
	name = $('#name').val();
	timeGet();
	inMsg = $('#inputMsg').val();
	var arr = {"name":name, "days":days, "inMsg":inMsg, "key":"send"};
        var JsonStr = JSON.stringify(arr);
        socket.send(JsonStr);
	inputMsg.value="";		 
   })

//切断ボタンがされたらする処理
    $('#disconnect').click(function(){
	name = $('#name').val();
	timeGet();
        var arr = {"name":name, "days":days, "key":"disCon"};
        var JsonStr = JSON.stringify(arr);
        socket.send(JsonStr);
    })
});

function es(str){
    str = str.replace(/&/g,"&amp;");
    str = str.replace(/"/g,"&quot;");
    str = str.replace(/'/g,"&#039;");
    str = str.replace(/</g,"&lt;");
    str = str.replace(/>/g,"&gt;");
    return str;
}



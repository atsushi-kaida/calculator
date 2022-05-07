var last = "";
var result = "";
var num1 = 0;
var num2 = 1;
var last_num = 0;
var preOp = 0;
var preZero;
var lastPriOp = "*";
var lastSecOp ="+";
var isNumber;

var $result = $('#result');

//num1は＋－による結果
//num2は×÷による結果
$(function(){
	$('.number').click(function(){
		if (!($result.hasClass('locked'))){
			//イコールの結果には数字を続けられない
			if (!($result.hasClass('equaled'))){
				
				/////////////////////////////////
				//実際に計算する（演算子コロコロ変えた時用）
				//演算子が来てたら掛け算を計算してnum2に入れる
				if($result.hasClass('op_end')){
					calcNum2();
					lastPriOp = last;
					console.log("lastPriOpを"+last+"に");
				}
				//＋－がきてたら和差算をしてnum1に入れる
				if($result.hasClass('uncalculated_num1')){
					calcNum1();
					lastSecOp = last;
					lastPriOp = "*";
					$result.removeClass('uncalculated_num1');
					console.log("num1を計算した");
				}
				last = $(this).text();
				console.log("last= " + last);
				//last_numの初期化
				if($result.hasClass('op_end')){
					last_num = 0;
				}
				
				/////////////////////////////////////////
				//表示に関わる処理
				//最初の0のときは書き換え
				if ($result.text()=="0"){
					//0or00を入力したときは0で
					if ($(this).hasClass('zero')){
						last = 0;
						console.log("0のまま");
					}else{
						console.log("0を書き換えた");
					}
					changeResult();
				//それ以外には右に続ける
				}else{
					if(($result.hasClass('op_end')||$result.hasClass('zero_start')) && $(this).hasClass('zero')){
						last = 0;
						console.log("00を0に");
					}
					////関数内で$thisが使えなかった
					//isNumber = $(this).hasClass('number');
					addResult();
					console.log("数字を続けた");
				}
				
				if(!($(this).hasClass('zero'))){
					$result.removeClass("zero_start");
				}
				if($result.hasClass('op_end') && $(this).hasClass('zero')){
					$result.addClass('zero_start');
					console.log("zero start");
				}
				//演算子を除いた部分(演算子コロコロ変える時用)
				preOp = $result.text();
				
				/////////////////////////////////////////////
				//計算に関わる処理
				last_num = last_num + "" + last;
				$result.removeClass('op_end div_end');
				console.log("result = "+$result.text());
		  }
		  console.log("num1,num2,last_num= "+num1 +","+ num2 + ","+last_num);
		  console.log('--------------------------------------');
		}
	});
	
	
	//////////////////////////////
	//////////////////////////////
	//小数点を押したとき
	$('#point').click(function(){
		if (!($result.hasClass('locked'))){
			//イコールの結果には小数点を続けられない
			if (!($result.hasClass('equaled'))){
				if ($result.hasClass('with_point')){
					console.log("二つ以上の小数点が含まれる");
				}else if($result.hasClass('op_end')){
					console.log("演算子で終わっている");
				//数字に対してのみ加わる
				}else{
					last = ".";
					console.log("last= " + last);
					isNumber = $(this).hasClass('number');
					addResult();
					console.log("小数点を続けた");
					
					//計算に関わる処理
					last_num = last_num + "" + last;
					console.log("result = "+$result.text());
					$result.addClass('with_point');
					$result.removeClass('zero_start');
				}
			}
			console.log("num1,num2,last_num= "+num1 +","+ num2 + ","+last_num);
		  console.log('--------------------------------------');
		}
	});
	
	
	
	
	/////////////////////////////////////////////////
	/////////////////////////////////////////////////
	//演算子を押したとき
	$('.operator').click(function(){
		last = $(this).text();
		console.log("last= "+last);
		
		if (!($result.hasClass('locked'))){
			///////////////////////////////
			//表示に関わる処理
			//末尾演算子に対する処理
			if ($result.hasClass('op_end')){
				changeOp();
				console.log("演算子を変更した");
			}else{
				isNumber = $(this).hasClass('number');
				addResult();
				console.log("演算子が加えられた");
			}
			$result.removeClass('with_point');
			
			
			
			
			
			////////////////////////////////////////////////////
			//計算に関わる処理
			//
			//全ての演算子が	未計算の掛け算をする
			//		±		が			左にまとめられてくnum1を計算する
			
			//     num1     ←     
			//							 |   num2   ←
			//  num1   num2  |lastn  last|
			// ((0 +) a x b) + (c x d) ±×÷
			
			
			//掛け算割り算
			if($(this).hasClass('primary')){
				$result.removeClass('uncalculated_num1');
				console.log("掛け算割り算が予約された");
				//
			//和差算
			}else if($(this).hasClass('secondary')){
				// + → x によって先走って間違ったnum1が計算されないようにする処理
				$result.addClass('uncalculated_num1');
				console.log("足し算引き算が予約された");
			}
			
			$result.addClass('op_end');
			$result.removeClass('equaled zero_start');
		  
		  console.log('result = '+$result.text());
		  console.log("num1,num2, last_num= "+num1 +","+ num2 + ","+last_num);
		  console.log('--------------------------------------');
		}
	});
	
	
	$('#reset').click(function(){
		num1 = 0;
		num2 = 1;
		last_num = 0;
		preOp = 0;
		lastSecOp = "+";
		last = "";
		result = "";
		$result.text("0");
		$result.addClass('uncalculated_num1');
		$result.removeClass('op_end div_end error with_point equaled uncalculated_num1 zero_start');
		console.log("resetした");
		console.log("num1,num2, last_num= "+num1 +","+ num2 + ","+last_num);
		console.log('--------------------------------------');
		console.log('--------------------------------------');
	});
	
	$('#equal').click(function(){
		if($result.hasClass('op_end')){
			console.log("演算子で終わっている");
		}else{
			calcNumAll();
			$result.text(result);
			last_num = result;
			num1 = 0;
			num2 = 1;
			preOp = $result.text();
			lastSecOp = "+";
			last = "";
			$result.addClass('equaled');
			$result.removeClass('op_end div_end zero_start');
			console.log("num1,num2, last_num= "+num1 +","+ num2 + ","+last_num);
		}
		console.log('--------------------------------------');
		console.log('--------------------------------------');
	});
	
});




function changeResult(){
	$result.text(last);
}

function addResult(){
	if($result.hasClass('zero_start') && isNumber ){
		$result.text(preZero+ "" + last);
		console.log("先頭の0を書き換えた");
	}else{
		preZero = $result.text();
		$result.text($result.text() + "" + last);
	}
}

function changeOp(){
	$result.text(preOp + "" + last);
}



function calcNum2(){
	if(lastPriOp =="*"){
		console.log(num2 + "に" + last_num + "をかけた");
		num2 = num2 * last_num;
	}else if (lastPriOp == "÷"){
		console.log(num2 + "を" + last_num + "で割った");
		num2 = num2 / last_num;
	}else{
		console.log("バグ＠calcNum2");
	}
	if (num2 == "Infinity" || isNaN(num2)){
		$result.addClass("error");
	}
}

function calcNum1(){
	if(lastSecOp == '+'){
		console.log(num1 + "に" + num2 + "を足した");
		num1 = num1 + num2;
		console.log("num1,num2, last_num= "+num1 +","+ num2 + ","+last_num);
	}else if(lastSecOp == '-'){
		console.log(num1 + "から" + num2 + "を引いた");
		num1 = num1 - num2;
		console.log("num1,num2, last_num= "+num1 +","+ num2 + ","+last_num);
	}else{
		console.log("error at calcNum1");
	}
	num2 = 1;
	lastPriOp = "*";
}

function calcNumAll(){
	calcNum2();
	calcNum1();
	$result.removeClass('uncalculated_num1');
	result = num1;
	if(String(result).length>11){
		
		//四捨五入はなし（くりあがれないため
		
		//var rounding = String(result).slice(12,13);
		//console.log("四捨五入する数字 = "+rounding);
		//if(rounding>5){
		//	rounding = 1;
		//}else{
		//	rounding =0;
		//}
		//var rounded = Number(String(result).slice(11,12)) + rounding;
		//console.log("足される数字 =" + String(result).slice(11,12));
		//console.log("四捨五入結果は"+rounded);
		//
		//console.log(rounded);
		//result = String(result).slice(0,11) + rounded;
		//if(String(result).length>11){
		//	result = result + "+e";
		result = String(result).slice(0,11) + "+e";
		
	}
	if($result.hasClass("error")){
		result = "error!";
	}
	console.log("計算結果は"+result);
}
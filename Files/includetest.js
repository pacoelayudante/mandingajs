console.log("init include test");

function setHashNums(num1, num2, num3){
	document.location.hash = "#"+num1+","+num2+","+num3;
}

function rotateAngle(objs,val) {
	for (i=0,len=objs.length; i<len; i++){
		objs[i].angle += val;
		objs[i].set_bbox_changed();
	}
}

function logThese(objs) {
	for (i=0,len=objs.length; i<len; i++){
		console.log(objs[i]);
	}
}
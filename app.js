var fs = require('fs');
var readline = require('readline');
var _ = require('underscore');
var objArray = []; //placeholder for person objects

var r1 = readline.createInterface(process.stdin,process.stdout);

var mydata = [];
mydata = fs.readFileSync('data/projects-data.js', 'utf8');
console.log(mydata);
//var mydataarray = JSON.parse('[' + mydata + ']');
//console.log(typeof mydataarray);
/*
//TEMPLATE
var x = {

	name: " ",
	author: " ",
	link: " ",
	description: " ",
	tech: " ",
	course: " ",
	custom: [" "],
	img_url:

};
pushToArray(x);
*/

function pushToArray(obj){
	objArray.push(obj);
}





//METHOD TO FIND UNIQUE KEY VALUE PAIRS
/*var tagsData = function(){

	var i = 0;
	var keyList;
	var outputArray = [];
	var tagsObjArray = _.pluck(objArray, 'tags');

	function makeKeyValueArray(array){
		array.forEach(function(element){
			var tagCategPair = {
				ctg: keyList[i].toLowerCase(),
				tag: element.toLowerCase()
			};
			outputArray.push(tagCategPair);
		});
		i++;
	};

	function findValues(keys){
		keyList = keys;
		_.each(keyList, function(element){
			var result = _.chain(tagsObjArray)
			.pluck(element)
			.flatten()
			.uniq()
			.value();
			makeKeyValueArray(result);
		});
	};

	function findKeys(){
		findValues(_.keys(tagsObjArray[0]));
	}

	findKeys();
	return JSON.stringify(outputArray);
}();


var projectsData = JSON.stringify(objArray);

var instructions = "";
instructions += "You will find the generated json file in the 'output' folder \n";
instructions += "To update the data displayed on the IM Gallery Page: \n";
instructions += "1. Upload the json file to the 'data' folder on Cyberduck \n";
instructions += "2. ... that's it! \n";
*/


if(!fs.existsSync('output/projects-data.json') && !fs.existsSync('output/tags-data.json')){
	//write projects data
	fs.writeFile('output/projects-data.json', projectsData, function (err) {
  		if (err) return console.log(err);
  		console.log("projects data file created!");
  		//write tags data, inside the callback to ensure synchronisity
		fs.writeFile('output/tags-data.json', tagsData, function (err) {
	  		if (err) return console.log(err);
	  		console.log("tags data file created!");
	  		console.log(instructions + '\n');
	  		r1.close();
		});
	});
	//write tags data
}else{
	r1.question("The files already exist. Do you want to overwrite them? (Y/N)", function(answer){
		if(answer.toLowerCase().trim() == 'y'){
			fs.writeFile('projects-data.json', projectsData, function (err) {
				if (err) return console.log(err);
				console.log("we overwrote the data file\n" + instructions);
				//r1.close();
			});
		}else{
			console.log("you are undecided");
			
		};

		r1.close();
	});
	
};


r1.on('close',function(){
	console.log("closing the interface");
	process.exit();
});
var fs = require('fs');
var readline = require('readline');
var _ = require('underscore');
var d3 = require('d3-dsv');
/*-----------------------------------------------------------------------*/
var r1 = readline.createInterface(process.stdin,process.stdout);
var tagsData, projectsData;
/*-----------------------------------------------------------------------*/

//read the csv file, turn it into a json string
projectsData = fs.readFileSync('data/project-data.csv', 'utf-8');
projectsData = d3.csvParse(projectsData, function(d, i){
	return {
		name: d.name,
		author: d.author,
		link: d.link,
		description: d.description,
		tags: {
			tech: d.tech,
			course: d.course,
			custom: d.custom.replace("-",",").replace(" ","-").split(",")
		},
		hashtag: d.hashtag,
		img_url: d.image,
		index: i
	};
});
//projectsData = JSON.stringify(projectsData.slice(0,projectsData.length - 1));
projectsData = JSON.stringify(projectsData);
//console.log(JSON.parse(projectsData));

//read the json file created above, find all unique category-tag pairs
var tagsData = function(){
	var i = 0;
	var keyList;
	var outputArray = [];
	var tagsObjArray = _.pluck(JSON.parse(projectsData), 'tags');
	//console.log("this is " + tagsObjArray);

	function makeKeyValueArray(keyval){
		//console.log(keyval);
		keyval.forEach(function(element){
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
			//console.log(result);
			makeKeyValueArray(result);

		});
	};

	function findKeys(){
		findValues(_.keys(tagsObjArray[0]));
	}

	findKeys();
	return JSON.stringify(outputArray);
}();

//user instructions
var instructions = "";
instructions += "You will find the generated json files in the 'output' folder \n";
instructions += "To update the data displayed on the IM Gallery Page: \n";
instructions += "put the json files to the 'data' folder on Cyberduck + make sure that project images are in the 'images' folder \n";
instructions += "for questions and concerns, please write an email to mk4908@nyu.edu";

//write json string to file
function writeToJSON(){
	fs.writeFile('output/projects-data.json', projectsData, function (err) {
			if (err) return console.log(err);
			console.log("projects data file created!");
			//write tags data, inside the callback to ensure synchronisity
		fs.writeFile('output/tags-data.json', tagsData, function (err) {
	  		if (err) return console.log(err);
	  		console.log("tags data file created!");
	  		console.log('---------------------------------------------');
	  		console.log(instructions + '\n');
	  		r1.close();
		});
	});
};

//if the output json files are not there, create them
if(!fs.existsSync('output/projects-data.json') && !fs.existsSync('output/tags-data.json')){
	writeToJSON();
//if the output json files already exist, ask for overwrite confirmation
}else{
	r1.question("The files already exist. Do you want to overwrite them? (Y/N)", function(answer){
		if(answer.toLowerCase().trim() == 'y'){
			writeToJSON();
		}else{
			console.log("you are undecided");
			r1.close();
		};
	});
};


r1.on('close',function(){
	console.log("closing the interface");
	process.exit();
});
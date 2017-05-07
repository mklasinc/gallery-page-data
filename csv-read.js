var fs = require('fs');
var d3 = require('d3-dsv');

fs.readFile('data/example-data.csv', 'utf-8',function(err,data){
	if(err) throw err;
	//console.log(data);

	var output = d3.csvParse(data, function(d, i){

		/*var customTags = d.custom.replace("-",",").replace(" ","-").split(",");
		console.log(customTags);*/

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
	console.log(output);
	output = output.slice(output.length-1);
	console.log(output[0].tags.custom);
});


var repl = require("repl");
var tty = require("tty");

root.stream_stack = [];
root.args = [];
process.stdin.setRawMode(true);
process.stdin.addListener("data", function(data){
	if(stream_stack.length == 0){
		process.exit();
	}
	stream_stack[stream_stack.length - 1].stream.emit("data", data);
});
process.stdin.resume();

root.repl = getrepl;

function getrepl(prompt_name){
	return function(){
			var args = arguments;
			setTimeout(function(){
					//process.stdout.write("\nEnter:"+prompt_name+"\n");
					if(stream_stack.length > 0){
						//prompt_name = stream_stack[stream_stack.length - 1].name + "/" + prompt_name;
						stream_stack[stream_stack.length - 1].stream.pause();
					}
					process.stdout.write("\n");
					var new_read_stream = new tty.ReadStream();
					new_read_stream.setRawMode(true);
					stream_stack.push({
						stream: new_read_stream,
						name: prompt_name,
						'args': args
					});
					root.args = args;
					var new_repl = repl.start({
						'prompt': prompt_name+"> ",
						input: new_read_stream,
						output: process.stdout
					}).on('exit', function(){
						//process.stdout.write("\nLeave:"+prompt_name+"\n");
						process.stdout.write("\n");
						stream_stack.pop();
						if(stream_stack.length == 0){
							process.exit();
						}
						process.stdout.write(stream_stack[stream_stack.length - 1].name + "> ");
						stream_stack[stream_stack.length - 1].stream.resume();
						root.args = stream_stack[stream_stack.length - 1].args;
					});
			}, 200);
	}
}

var top_repl = getrepl("");
top_repl();


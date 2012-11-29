# sub-repl -- An REPL environment which allow you to spawn new repls

## Install

<pre>
	npm install sub-repl
</pre>

## Example

```javascript
$ sub-repl
> var request = require("request")
> request.get("http://www.google.com/", repl("result"))
result> args[1]
... Here goes the HTML ...
result> .exit
> .exit
$ 
```


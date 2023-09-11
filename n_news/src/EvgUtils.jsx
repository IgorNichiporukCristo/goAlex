function add_evg_func(name, func)
{
    if (window.evg_functions === undefined)
	window.evg_functions = [];
    window.evg_functions.push(
	{
	    name: name,
	    func: func
	}
    );
}

function exec_evg_func(name, arg)
{
    if (window.evg_functions === undefined || !Array.isArray(window.evg_functions))
	return ;
    let y = window.evg_functions.find((i) => i.name === name);
    y.func(arg);
}

function get_evg_func(name)
{
    try {
	if (window.evg_functions === undefined || !Array.isArray(window.evg_functions))
	    throw "n/e";
	let y = window.evg_functions.find((i) => i.name === name);
	if (y === undefined)
	    throw "n/e";
	return y.func;
    }
    catch(e) {
	if (e === "n/e") {
	    alert("function '" + name + "' doesn't exist :(");
	}
	else {
	    alert("Something unexpected happened when executing function get_evg_func: " + e);
	}
    }
}


export {add_evg_func, exec_evg_func, get_evg_func};

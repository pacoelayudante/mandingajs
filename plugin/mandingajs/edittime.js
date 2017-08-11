function GetPluginSettings()
{
	return {
		"name":			"Mandinga JS",
		"id":			"Mandinga",
		"version":		"0.1",
		"description":	"Easy linking between Construct 2 and javascript.",
		"author":		"Paco",
		"help url":		"http://www.scirra.com/manual/149/function",
		"category":		"General",
		"type":			"object",			// not in layout
		"rotatable":	false,
		"flags":		pf_singleglobal
	};
};

//////////////////////////////////////////////////////////////
// Conditions
AddStringParam("File", "The file that was just loaded.", "\"script.js\"");
AddComboParamOption("Every");
AddComboParamOption("First");
AddComboParam("Wich", "Is this called only on first load, or every time you call include on this file?");
AddCondition(0,	cf_trigger , "On script loaded", "Mandinga", "On <b>{0}</b> loaded ({1})", "When the called file finishes loading (and running).", "OnLoaded");

AddStringParam("File", "The file you want to know if was loaded. Works with include only.", "\"script.js\"");
AddCondition(1,	cf_none , "Is file loaded", "Mandinga", "<b>{0}</b> is loaded", "Checks if this file was included and loaded already.", "IsLoaded");
//////////////////////////////////////////////////////////////
// Actions
AddStringParam("File", "The file you want to include.", "\"script.js\"");
AddAction(0, 0, "Include script", "Mandinga", "Include <b>{0}</b>", "Include some js file. It won't run twice on same file.", "Include");

AddStringParam("File", "The file you want to run.", "\"script.js\"");
AddAction(1, 0, "Run script", "Mandinga", "Run <b>{0}</b>", "Run some js file. Careful, this can be run more than once.", "Run");

AddStringParam("Function", "The name of the function to call.", "\"myFunc\"");
AddVariadicParams("Parameter {n}", "A parameter to pass for the function call.");
AddAction(2, 0, "Call function", "Mandinga", "<b>{0}</b> (<i>{...}</i>)", "Call some javascript function (or whatever). Careful with this.", "Function");

AddStringParam("Function", "The name of the function to call.", "\"myFunc\"");
AddObjectParam("Object Parameter","Pass picked instances of this object");
AddVariadicParams("Parameter {n}", "Additional parameter to pass for the function call.");
AddAction(3, 0, "Call function with objects", "Mandinga", "<b>{0}</b> (<i>{1},{...}</i>)", "Call some javascript function passing instances as first parameter. Extra careful here.", "FunctionWithObjects");
//////////////////////////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_any, "", "Mandinga", "ReturnValue", "Get the value returned by the last function (only numbers or strings, otherwise it's 0).");

AddNumberParam("File", "The file you want to know if was loaded.");
AddExpression(1, ef_return_any, "", "Mandinga", "IsLoaded", "Checks if this file was included and loaded already.");

AddStringParam("Name", "The name of the function to call.");
AddExpression(2, ef_return_any | ef_variadic_parameters, "", "Mandinga", "Function", "Call some javascript function.");

ACESDone();

// Property grid properties for this plugin
var property_list = [
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance, this);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}
	
// Called by the IDE to draw this instance in the editor
IDEInstance.prototype.Draw = function(renderer)
{
}

// Called by the IDE when the renderer has been released (ie. editor closed)
// All handles to renderer-created resources (fonts, textures etc) must be dropped.
// Don't worry about releasing them - the renderer will free them - just null out references.
IDEInstance.prototype.OnRendererReleased = function()
{
}

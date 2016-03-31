greenhorn
---------

A simple application intended to provide an easy way to hand off development of HTML views/templates
to an uninitiated or outside developer. Greenhorn reads a greenhorn.json file which contains some basic
information including the data context in which a template is rendered. This allows one to provide only
sample data and not the entire application when all that needs to be developed is an HTML view.

install
-------

```shell
npm install -g greenhorn
```

usage
-----

### Create a greenhorn.json file

```json
{
	"title" : "product-view",
	"data" : {
		"sku" : "12345",
		"name" : "Thingamabob"
	}
}
```

### Execute

```shell
$ greenhorn
```

### Develop your view

For example test.jade

### Open your browser

Open your browser to http://localhost:5000/test.jade


todo
----

* add support for remote greenhorn.json
* add support for specifying greenhorn.json path via argv
* greenhorn.json
	* add support for specified routes
	* add support for static content
* add web interface
	* load remote greenhorn.json
	* load a specific /path
	* selectable datasets to apply to a view

license
-------

MIT

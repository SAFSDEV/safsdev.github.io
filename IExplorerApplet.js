d=document;
var sa=d.createElement('OBJECT');
sa.setAttribute('classid','clsid:8AD9C840-044E-11D1-B3E9-00805F499D93');
sa.setAttribute('codebase','http://java.sun.com/products/plugin/1.5/plugin-install.html');
sa.setAttribute('width','0');
sa.setAttribute('height','0');

var app=sa.appendChild(d.createElement("<PARAM NAME=CODE VALUE='java.applet.Applet.class'>"));
var apptype=sa.appendChild(d.createElement("<PARAM NAME='type' VALUE='application/x-java-applet;version=1.5'>"));
var scriptable=sa.appendChild(d.createElement("<PARAM NAME='scriptable' VALUE='true'>"));
var mayscript=sa.appendChild(d.createElement("<PARAM NAME='MAYSCRIPT' VALUE='true'>"));

d.getElementsByTagName('html')[0].appendChild(sa);

(function(){var H=YAHOO.lang,R=YAHOO.env.ua,O=YAHOO.widget.Button.prototype,C=O.initAttributes,M=YAHOO.widget.ButtonGroup.prototype,S=M.initAttributes,G=M.addButton,V=(R.gecko&&R.gecko>=1.9)||(R.ie&&R.ie>=8),N="aria-",W="usearia",K="checked",E="type",h="menu",a="split",I="haspopup",b="render",T="radio",Z="checkbox",e="role",c="checkedChange",X="presentation",F="element",Q="radiogroup",U="checkedButtonChange",L="appendTo",D="labelledby",g="describedby",f="id";if(V){O.RADIO_DEFAULT_TITLE="";O.RADIO_CHECKED_TITLE="";O.CHECKBOX_DEFAULT_TITLE="";O.CHECKBOX_CHECKED_TITLE="";}var d=function(i,j){i.setAttribute(e,j);};var Y=function(i,k,j){i.setAttribute((N+k),j);};var A=function(k,i,j){this.cfg.setProperty(W,true);this.cfg.setProperty(D,j.get(f));};var B=function(){this._menu.subscribe(b,A,this);};var P=function(i){Y(this._button,K,i.newValue);};H.augmentObject(O,{_setUseARIA:function(j){var k=this.get(E),i=this._button;if(j){switch(k){case h:case a:Y(i,I,true);this.on(L,B);break;case T:case Z:d(i,k);Y(i,K,this.get(K));this.on(c,P);break;}}},initAttributes:function(i){this.setAttributeConfig(W,{value:i.usearia||V,validator:H.isBoolean,writeOnce:true,method:this._setUseARIA});C.apply(this,arguments);if(V){this.set(W,true);}}},"initAttributes","_setUseARIA");var J=function(j){var i=j.prevValue;if(i){i._button.tabIndex=-1;}j.newValue._button.tabIndex=0;};H.augmentObject(M,{addButton:function(k){var l=G.call(this,k),j,i;if(this.get(W)){l.set(W,true);j=l._button;i=j.parentNode;d(i,X);d(i.parentNode,X);j.tabIndex=l.get(K)?0:-1;}return l;},_setUseARIA:function(i){if(i){d(this.get(F),Q);this.on(U,J);}},_setLabelledBy:function(i){if(this.get(W)){Y(this.get(F),D,i);}},_setDescribedBy:function(i){if(this.get(W)){Y(this.get(F),g,i);}},initAttributes:function(i){this.setAttributeConfig(W,{value:i.usearia||V,validator:H.isBoolean,writeOnce:true,method:this._setUseARIA});this.setAttributeConfig(D,{value:i.labelledby,validator:H.isString,method:this._setLabelledBy});this.setAttributeConfig(g,{value:i.describedby,validator:H.isString,method:this._setDescribedBy});S.apply(this,arguments);if(V){this.set(W,true);}}},"initAttributes","_setUseARIA","_setLabelledBy","_setDescribedBy","addButton");}());YAHOO.register("buttonariaplugin",YAHOO.widget.Button,{version:"@VERSION@",build:"@BUILD@"});
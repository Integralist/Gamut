/*
	PureDOM explorer 3.0
	written by Christian Heilmann (http://icant.co.uk)
	Please refer to the pde homepage for updates: http://www.onlinetools.org/tools/puredom/
	Free for non-commercial use. Changes welcome, but no distribution without 
	the consent of the author.
*/
pde={
	// CSS classes
	pdeClass:'pde',
	hideClass:'hide',
	showClass:'show',
	parentClass:'parent',
	currentClass:'current',
	// images added to the parent links
	openImage:'Close.gif',
	closedImage:'Open.gif',
	openMessage:'close section',
	closedMessage:'open section',

	init:function(){
		var inneruls,parentLI;
		pde.createClone();
		if(!document.getElementById || !document.createTextNode){return;}
		var uls=document.getElementsByTagName('ul');
		for(var i=0;i<uls.length;i++){
			if(!pde.cssjs('check',uls[i],pde.pdeClass)){continue;}
			var inneruls=uls[i].getElementsByTagName('ul');
			for(var j=0;j<inneruls.length;j++){
				parentLI=inneruls[j].parentNode;
				if(parentLI.getElementsByTagName('strong')[0]){
					pde.cssjs('add',parentLI,pde.currentClass);
					continue;
				}
				pde.cssjs('add',parentLI,pde.parentClass);
				parentLI.insertBefore(pde.clone.cloneNode(true),parentLI.firstChild);
				pde.cssjs('add',inneruls[j],pde.hideClass);
				pde.addEvent(parentLI.getElementsByTagName('a')[0],'click',pde.showhide,false);
				parentLI.getElementsByTagName('a')[0].onclick=function(){return false;} // Safari hack
			}
		}
	},
	showhide:function(e){
		var image,message;
		var elm=pde.getTarget(e);
		var ul=elm.parentNode.getElementsByTagName('ul')[0];
		var img=elm.parentNode.getElementsByTagName('img')[0];
		if(pde.cssjs('check',ul,pde.hideClass)){
			message=pde.openMessage;
			image=pde.openImage;
			pde.cssjs('remove',elm.parentNode.getElementsByTagName('ul')[0],pde.hideClass);
			pde.cssjs('add',elm.parentNode.getElementsByTagName('ul')[0],pde.showClass);
		} else {
			message=pde.closedMessage;
			image=pde.closedImage;
			pde.cssjs('remove',elm.parentNode.getElementsByTagName('ul')[0],pde.showClass);
			pde.cssjs('add',elm.parentNode.getElementsByTagName('ul')[0],pde.hideClass);
		}
		img.setAttribute('src',image);
		img.setAttribute('alt',message);
		img.setAttribute('title',message);
		pde.cancelClick(e);
	},
	createClone:function(){
		pde.clone=document.createElement('a');
		pde.clone.setAttribute('href','#');
		pde.clone.appendChild(document.createElement('img'));
		pde.clone.getElementsByTagName('img')[0].src=pde.closedImage;
		pde.clone.getElementsByTagName('img')[0].alt=pde.closedMessage;
		pde.clone.getElementsByTagName('img')[0].title=pde.closedMessage;
	},
/* helper methods */
	getTarget:function(e){
		var target = window.event ? window.event.srcElement : e ? e.target : null;
		if (!target){return false;}
		if (target.nodeName.toLowerCase() != 'a'){target = target.parentNode;}
		return target;
	},
	cancelClick:function(e){
		if (window.event){
			window.event.cancelBubble = true;
			window.event.returnValue = false;
			return;
		}
		if (e){
			e.stopPropagation();
			e.preventDefault();
		}
	},
	addEvent: function(elm, evType, fn, useCapture){
		if (elm.addEventListener) 
		{
			elm.addEventListener(evType, fn, useCapture);
			return true;
		} else if (elm.attachEvent) {
			var r = elm.attachEvent('on' + evType, fn);
			return r;
		} else {
			elm['on' + evType] = fn;
		}
	},
	cssjs:function(a,o,c1,c2){
		switch (a){
			case 'swap':
				o.className=!pde.cssjs('check',o,c1)?o.className.replace(c2,c1):o.className.replace(c1,c2);
			break;
			case 'add':
				if(!pde.cssjs('check',o,c1)){o.className+=o.className?' '+c1:c1;}
			break;
			case 'remove':
				var rep=o.className.match(' '+c1)?' '+c1:c1;
				o.className=o.className.replace(rep,'');
			break;
			case 'check':
				return new RegExp("(^|\s)" + c1 + "(\s|$)").test(o.className)
			break;
		}
	}
}
pde.addEvent(window, 'load', pde.init, false);

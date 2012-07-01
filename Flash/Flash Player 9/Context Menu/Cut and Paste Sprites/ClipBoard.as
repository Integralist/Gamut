//****************************************************************************
// Copyright (C) 2005-2007 Adobe Systems Incorporated. All Rights Reserved.
// The following is Sample Code and is subject to all restrictions on such code
// as contained in the End User License Agreement accompanying this product.
//****************************************************************************

package {
	import flash.display.MovieClip;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	public class ClipBoard extends Object {

		public static var contents:Object;
		public static var action:String;

		public function ClipBoard() {
		}
		public static function cut(obj:Object):void {
			obj.alpha = 0.5;
			contents = obj;
			action = "cut";
		}
		public static function copy(obj:Object):void {
			contents = obj;
			action = "copy";
		}
		public static function paste():void {
			var pt:Point;
			if (action == "cut") {
				pt = contents.localToGlobal(new Point(contents.mouseX, contents.mouseY));
				contents.x = pt.x;
				contents.y = pt.y;
				contents.alpha = 1;
				contents = undefined;
				action = "";
			} else if (action == "copy") {
				var newdepth:int = contents.parent.numChildren;
				var shape:MovieClip;
				switch (contents.name) {
					case "squareClip":
						shape = new square();
						break;
					case "circleClip":
						shape = new circle();
						break;
					case "polystarClip":
						shape = new polystar();
						break;
				}

				shape.addEventListener(MouseEvent.MOUSE_DOWN, contents.parent.startDragHandler);
				shape.addEventListener(MouseEvent.MOUSE_UP, contents.parent.stopDragHandler);
				shape.contextMenu = contents.contextMenu;
				pt = contents.localToGlobal(new Point(contents.mouseX, contents.mouseY));
				shape.x = pt.x;
				shape.y = pt.y;
				shape.alpha = 1;
				contents.alpha = 1;
				contents.parent.addChild(shape);
			} else {
				return;
			}
		}
		public function isEmpty():Boolean {
			if (contents != null) {
				return false;
			} else {
				return true;
			}
		}
		public function handleMenuCommand(obj:Object, item:Object):void {
			switch (item.caption) {
				case "Cut object" :
					cut(obj);
					break;
				case "Copy object" :
					copy(obj);
					break;
				case "Paste object" :
					paste();
					break;
			}
		}
	}
}

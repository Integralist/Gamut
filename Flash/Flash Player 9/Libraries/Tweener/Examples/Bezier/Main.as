/*
Main document class
*/

package {
	import flash.events.*;
	import flash.display.*;

	import caurina.transitions.Tweener;


	public class Main extends MovieClip {

//		var basePanel:MovieClip;
//		var p1:MovieClip;
//		var p2:MovieClip;
//		var ball:MovieClip;

		var pLine:MovieClip;
		var selectedPoint:MovieClip;
		var controlPoints:Array;
		var curvePoints:Array;

		public function Main() {
			stage.scaleMode = StageScaleMode.NO_SCALE;
			stage.align = StageAlign.TOP_LEFT;
			stage.addEventListener(Event.RESIZE, onResize);
			onResize();
			
			pLine = new MovieClip();
			addChild(pLine);
		
			selectedPoint = null;
			controlPoints = [];
			curvePoints = [];
			addControlPoint(250, 200);
	
			// Setup buttons
			basePanel.bAdd.addEventListener(MouseEvent.CLICK, function() {
				addControlPoint();
			});
			basePanel.bRemove.addEventListener(MouseEvent.CLICK, function() {
				removeCurrentPoint();
			});
			basePanel.bFullscreen.addEventListener(MouseEvent.CLICK, function() {
				if (stage.displayState == "fullScreen") {
					stage.displayState = "normal";
				} else {
					stage.displayState = "fullScreen";
				}
			});
	
			redraw();
			playBall();
	
		}

		public function addControlPoint(p_x:Number = NaN, p_y:Number = NaN, p:Number = NaN):void {
			// Adds a control point
			var i:Number;
			
			if (isNaN(p)) {
				// Finds the good index for a new point based on the selected point
				if (selectedPoint == null) {
					// Last
					p = controlPoints.length;
				} else {
					// Last by default?
					p = controlPoints.length;
					for (i = 0; i < controlPoints.length; i++) {
						if (controlPoints[i] == selectedPoint) {
							p = i + 1;
							break;
						}
					}
				}
					
			}
		
			if (isNaN(p_x) || isNaN(p_y)) {
				// Find the better position
				var lPoint:MovieClip = (p == 0) ? p1 : controlPoints[p-1];
				var rPoint:MovieClip = (p == controlPoints.length) ? p2 : controlPoints[p];
				p_x = (lPoint.x + rPoint.x)/2;
				p_y = (lPoint.y + rPoint.y)/2;
			}
			var cm:MovieClip = new DraggableControlPoint();
			addChild(cm);
			cm.x = p_x;
			cm.y = p_y;
			cm.alpha = 1;
			controlPoints.splice(p, 0, cm);
			redraw();
			playBall();

		}

		public function removeControlPoint(p:Number):void {
			// Removes the last control point
			var cm:MovieClip;
			if (controlPoints.length > 0) {
				cm = controlPoints[p];
				controlPoints.splice(p, 1);
				removeChild(cm);
				redraw();
				playBall();
			}
		}

		public function setSelectedPoint(pmc:MovieClip = null):void {
			// Selects a point
			if (pmc == selectedPoint) return;
			
			// Deselect current
			if (selectedPoint != null && selectedPoint.isBezier) selectedPoint.alpha = 1;
		
			// Select new
			selectedPoint = pmc;
			if (selectedPoint != null && selectedPoint.isBezier) selectedPoint.alpha = 2;
		}


		public function removeCurrentPoint():void {
			// Removes the point currently selected only if it's a bezier point
			var i:uint;

			if (Boolean(selectedPoint) && selectedPoint.isBezier) {
				for (i = 0; i < controlPoints.length; i++) {
					if (controlPoints[i] == selectedPoint) {
						removeControlPoint(i);
						setSelectedPoint();
						return;
					}
				}
			}
		}

		public function playBall():void {
			// Plays the ball using the bezier values
			ball.x = p1.x;
			ball.y = p1.y;
		
			var i:uint;
		
			// Creates list of control points
			var bezierList:Array = [];
			for (i = 0; i < controlPoints.length; i++) {
				bezierList.push({x:controlPoints[i].x, y:controlPoints[i].y});
			}
			Tweener.addTween(ball, {x:p2.x, y:p2.y, _bezier:bezierList, time:1, transition:"easeOutElastic"});
		
		}

		public function redraw():void {
			// Redraws the path it makes so it's easier to understand
		
			var i:uint;
		
			for (i = 0; i < curvePoints.length; i++) {
				removeChild(curvePoints[i]);
				curvePoints[i] = null;
			}
			curvePoints = [];
		
			// Draws path curve and curve points
			var g:Graphics = pLine.graphics;
			g.clear();
			g.lineStyle(3, 0x000000, 0.8);
			var startX:Number = p1.x;
			var startY:Number = p1.y;
			var endX:Number, endY:Number;
			var thisPoint:MovieClip;
			var nextPoint:MovieClip;
			g.moveTo(startX, startY);
			for (i = 0; i < controlPoints.length-1; i++) {
				thisPoint = controlPoints[i];
				nextPoint = controlPoints[i+1];
				endX = (thisPoint.x + nextPoint.x) / 2;
				endY = (thisPoint.y + nextPoint.y) / 2;
				g.curveTo(thisPoint.x, thisPoint.y, endX, endY);
				// Draw curve points for reference
				drawCurvePoints(startX, startY, thisPoint.x, thisPoint.y, endX, endY);
				startX = endX;
				startY = endY;
			}
			if (controlPoints.length > 0) {
				// Normal curve
				var lastPoint:MovieClip = controlPoints[controlPoints.length - 1];
				g.curveTo(lastPoint.x, lastPoint.y, p2.x, p2.y);
				drawCurvePoints(startX, startY, lastPoint.x, lastPoint.y, p2.x, p2.y);
			} else {
				// Just a line!
				g.lineTo(p2.x, p2.y);
				drawLinePoints(startX, startY, p2.x, p2.y);
			}
		
			// Draw bezier control lines
			g.lineStyle(1, 0x000000, 0.2);
			g.moveTo(p1.x, p1.y);
			for (i = 0; i < controlPoints.length; i++) {
				thisPoint = controlPoints[i];
				g.lineTo(thisPoint.x, thisPoint.y);
			}
			g.lineTo(p2.x, p2.y);
		
			// Creates the code
			var cs:String = "";
			cs += "// Import the class\n";
			cs += "import caurina.transitions.Tweener;\n";
			cs += "\n";
		
			cs += "// Reset the position of the MovieClip\n";
			cs += "ball.x = " + p1.x + ";\n";
			cs += "ball.y = " + p1.y + ";\n";
			cs += "\n";
		
			// Creates list of control points
			var bezierList:Array = [];
			for (i = 0; i < controlPoints.length; i++) {
				bezierList.push("{x:"+controlPoints[i].x+", y:"+controlPoints[i].y+"}");
			}
			var bezierParameter:String;
			if (bezierList.length == 0) {
				// No bezier point
				bezierParameter = "";
			} else if (bezierList.length == 1) {
				// Single control point, no array is needed
				bezierParameter = ", _bezier:" + bezierList[0];
			} else {
				// Array of control points
				bezierParameter = ", _bezier:[" + bezierList.join(", ") + "]";
			}
		
			cs += "// Animate\n";
			cs += "Tweener.addTween(ball, {x:" + p2.x + ", y:" + p2.y + bezierParameter + ", time:1, transition:\"linear\"});\n";
		
			basePanel.codeCaption.text = cs;

			// Move all draggable buttons to the top
			setChildIndex(p1, numChildren - 1);
			setChildIndex(p2, numChildren - 1);
			for (i = 0; i < controlPoints.length; i++) setChildIndex(controlPoints[i], numChildren - 1);

		}

		public function drawCurvePoints(px1:Number, py1:Number, cx:Number, cy:Number, px2:Number, py2:Number):void {
			// Draws points on curves
			var i:Number;
			for (i = 0; i < 1; i+= 1/10) {
				var pt = pennerPointOnCurve(px1, py1, cx, cy, px2, py2, i);
				var cp:MovieClip = new CurvePoint();
				cp.x = pt.x;
				cp.y = pt.y;
				cp.alpha = 0.2;
				addChild(cp);
				curvePoints.push(cp);
			}
		}

		public function drawLinePoints (px1:Number, py1:Number, px2:Number, py2:Number):void {
			// Draws points on a line
			var i:Number;
			for (i = 0; i < 1; i+= 1/10) {
				var pt = {x:px1*(1-i)+px2*i, y:py1*(1-i)+py2*i};
				var cp:MovieClip = new CurvePoint();
				cp.x = pt.x;
				cp.y = pt.y;
				cp.alpha = 0.2;
				addChild(cp);
				curvePoints.push(cp);
			}
		}


		// http://ibiblio.org/e-notes/Splines/Bezier.htm
		public function pennerPointOnCurve(p1x, p1y, cx, cy, p2x, p2y, t):Object {
			// Returns the points on a bezier curve for a given time (t is 0-1);
			// This is based on Robert Penner's Math.pointOnCurve() function
			// More information: http://actionscript-toolbox.com/samplemx_pathguide.php
			return {x:p1x + t*(2*(1-t)*(cx-p1x) + t*(p2x - p1x)),
					y:p1y + t*(2*(1-t)*(cy-p1y) + t*(p2y - p1y))};
			// Quadratic Bezier spline
		}

		public function onResize(e:Event = null):void {
			basePanel.y = stage.stageHeight - 160;
		}

	}
}

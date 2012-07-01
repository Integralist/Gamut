package
{
    import fl.controls.TextInput;
    import fl.managers.FocusManager;
    import flash.display.InteractiveObject;
    import flash.display.Sprite;
    import flash.events.*;
    import flash.utils.Timer;

    public class FocusManagerExample extends Sprite 
    {
        private var fm:FocusManager;
        
        public function FocusManagerExample()
		{
            buildGridOfTextInputs();

            fm = new FocusManager(this);
            var t:Timer = new Timer(1000);
            t.addEventListener(TimerEvent.TIMER,secondPassed);
            t.start();
        }
		
        private function buildGridOfTextInputs():void
		{
            var rowSpacing:uint = 30;
            var colSpacing:uint = 110;
            var totalRows:uint = 4;
            var totalCols:uint = 3;
            var i:uint;
            
            for(i = 0; i < totalRows * totalCols; i++)
			{
                var ti:TextInput = new TextInput()
                ti.name = "component"+i.toString();
                ti.addEventListener(FocusEvent.FOCUS_IN,focusChange);
                ti.setSize(100,20);
                ti.x = 10 + ((i % totalCols) * colSpacing);
                ti.y = 10 + (Math.floor(i / totalCols) * rowSpacing);
                ti.tabEnabled = true;
                addChild(ti);
            }
        }
		
        private function secondPassed(e:TimerEvent):void
		{
            var nextComponent:InteractiveObject = fm.getNextFocusManagerComponent();
            fm.setFocus(nextComponent);    
        }
        
        private function focusChange(e:FocusEvent):void
		{
            trace("Focus change: " + e.target.name);
        }
    }
}
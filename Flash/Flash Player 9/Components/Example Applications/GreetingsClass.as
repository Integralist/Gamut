package
{
    import flash.display.Sprite;
    import flash.events.Event;
    import flash.events.MouseEvent;
    import flash.text.TextFormat;
    import fl.events.ComponentEvent;
    import fl.events.ColorPickerEvent;
    import fl.controls.ColorPicker;
    import fl.controls.ComboBox;
    import fl.controls.RadioButtonGroup;
    import fl.controls.RadioButton;
    import fl.controls.TextArea;
	
    public class GreetingsClass extends Sprite
	{
        private var aTa:TextArea;
        private var msgCb:ComboBox;
        private var smallRb:RadioButton;
        private var largerRb:RadioButton;
        private var largestRb:RadioButton;
        private var rbGrp:RadioButtonGroup;
        private var txtCp:ColorPicker;
        private var tf:TextFormat = new TextFormat();
		
        public function GreetingsClass()
		{
			createUI();
		    setUpHandlers();
		}
		
		private function createUI()
		{
			bldTxtArea();
			bldColorPicker();
			bldComboBox();
			bldRadioButtons();
		}
		
		// ADD TEXT AREA COMPONENT
		private function bldTxtArea()
		{
			aTa = new TextArea();
			aTa.setSize(230, 44);
			aTa.text = "Hello World!";
			aTa.move(165, 57);
			addChild(aTa);
		}
		
		// ADD COLOUR PICKER COMPONENT
		private function bldColorPicker()
		{
			txtCp = new ColorPicker();
			txtCp.move(96, 72);
			addChild(txtCp);
		}
		
		// ADD DROP DOWN "COMBO BOX" COMPONENT
		private function bldComboBox()
		{
			msgCb = new ComboBox();
			msgCb.width = 130;
			msgCb.move(265, 120);
			msgCb.prompt = "Greetings";
			msgCb.addItem({data:"Hello.", label:"English"});            
			msgCb.addItem({data:"Bonjour.", label:"Français"});            
			msgCb.addItem({data:"¡Hola!", label:"Español"});            
			addChild(msgCb);
		}
		
		// ADD GROUP OF RADIO BUTTONS COMPONENT
		private function bldRadioButtons()
		{
			rbGrp = new RadioButtonGroup("fontRbGrp");
			smallRb = new RadioButton();
			smallRb.setSize(100, 22);
			smallRb.move(155, 120);
			smallRb.group = rbGrp; //"fontRbGrp";
			smallRb.label = "Small";
			smallRb.name = "smallRb";
			addChild(smallRb);
			
			largerRb = new RadioButton();
			largerRb.setSize(100, 22);
			largerRb.move(155, 148);
			largerRb.group = rbGrp;
			largerRb.label = "Larger";
			largerRb.name = "largerRb";
			addChild(largerRb);
			
			largestRb = new RadioButton();
			largestRb.setSize(100, 22);
			largestRb.move(155, 175);
			largestRb.group = rbGrp;
			largestRb.label = "Largest";
			largestRb.name = "largestRb";
			addChild(largestRb);
		}
		
		// SETUP EVENT LISTENERS
		private function setUpHandlers():void
		{
			rbGrp.addEventListener(MouseEvent.CLICK, rbHandler);
			txtCp.addEventListener(ColorPickerEvent.CHANGE,cpHandler);
			msgCb.addEventListener(Event.CHANGE, cbHandler);
		}
		
		// CHANGE FONT SIZE
		private function rbHandler(e:MouseEvent):void
		{
			switch(e.target.selection.name)
			{
				case "smallRb":
					tf.size = 14;
					break;
				case "largerRb":
					tf.size = 18;
					break;
				case "largestRb":
					tf.size = 24;
					break;
			}
			aTa.setStyle("textFormat", tf);
		}
		
		// CHANGE FONT COLOUR
		private function cpHandler(e:ColorPickerEvent):void
		{
			tf.color = e.target.selectedColor;
			aTa.setStyle("textFormat", tf);
		}
		
		// CHANGE TEXT
		private function cbHandler(e:Event):void
		{
			aTa.text = e.target.selectedItem.data;
		}
	}
}
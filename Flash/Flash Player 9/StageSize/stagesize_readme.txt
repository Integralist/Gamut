This sample, stagesize.fla, demonstrates how the Stage.scaleMode property affects the values of Stage.width and Stage.height when the browser window is resized.

The value of the width and height properties depend on the value
of the Stage.scaleMode property.

If Stage.scaleMode is set to "noScale", then the movie is not scaled. The values of the Stage.width and Stage.height properties change as you resize the player window, but the movie remains the same size. 

If Stage.scaleMode is set to "exactFit" or "showAll" or "noBorder", then the movie may be scaled to fit the player window. The values set in the Document Properties dialog box are preserved. This means that the values of Stage.width and Stage.height remain constant even as you resize the player window. 

Test this sample by follow these steps:

1) Publish this SWF file using "noScale" to confirm that the values change when the player windows in resized. 
2) Uncomment the Stage.scaleMode = "showAll" line to confirm that the values remain constant if the player window is resized. 3) Keep in mind that if you do not explicitly define Stage.scaleMode, then the authoring tool's player defaults to "noScale" while the Standalone Player and the browser plug-in default to "showAll".
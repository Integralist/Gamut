Read the following before using the files within this archive.

1. This archive contains a Reflect.as file that belongs to the article at: 
http://www.adobe.com/devnet/flash/articles/reflect_class_as3.html

The file contained within this archive provides you with the complete source code to the Reflect class.


2. Unpack the archive and put the nested file in the following locations:
   ---------------------------------------------------------------
   Reflect.as should be nested within the library package path of: com/pixelfumes/reflect. For example, if your FLA was in a "flash" directory, you would place the Reflect.as file in the flash\com\pixelfumes\reflect\ directory.

   You can instantiate an instance of the Reflect class within your Flash movie using the code example below*:
   
   import com.pixelfumes.reflect.*;
   var r1:Reflect = new Reflect({mc:ref_mc, alpha:50, ratio:50, distance:0, updateTime:0, reflectionDropoff:1});

   *The code example above assumes that you want to reflect a movie clip with an instance name of ref_mc.
  
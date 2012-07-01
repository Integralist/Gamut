// Import the Tweener Library
import caurina.transitions.*;

/*
Define the NetConnection object and pass null for its connection method.
Null is used when no Flash Media Server is available
Pass reference of NetConnection object to the NetStream object
*/
var nc:NetConnection = new NetConnection();
	nc.connect(null);
var ns:NetStream = new NetStream(nc);
	ns.bufferTime = 0; // Set buffer limit (we want 0 seconds of the video to be loaded before playing)
	
// Videos to be played throughout the animation
var directory:String = "Footage/";
var videos:Array = ["Part1.flv", "Part2.flv", "Part3.flv", "Part4.flv", "Part5.flv", "Part6.flv", "Part7.flv"];

// URL for video which will be played first
var url:String = directory + videos[0];

// Create Video object for each
var video:Video = new Video(553, 311);
video.x = 0;
video.y = 0;
video.attachNetStream(ns);
ns.play(url);
ns.pause();

// Preload the other videos
var ns2:NetStream = new NetStream(nc);
var video2:Video = new Video(553, 311);
video2.x = 0;
video2.y = 0;
video2.attachNetStream(ns2);

var ns3:NetStream = new NetStream(nc);
var video3:Video = new Video(553, 311);
video3.x = 0;
video3.y = 0;
video3.attachNetStream(ns3);

var ns4:NetStream = new NetStream(nc);
var video4:Video = new Video(553, 311);
video4.x = 0;
video4.y = 0;
video4.attachNetStream(ns4);

var ns5:NetStream = new NetStream(nc);
var video5:Video = new Video(553, 311);
video5.x = 0;
video5.y = 0;
video5.attachNetStream(ns5);

var ns6:NetStream = new NetStream(nc);
var video6:Video = new Video(553, 311);
video6.x = 0;
video6.y = 0;
video6.attachNetStream(ns6);

var ns7:NetStream = new NetStream(nc);
var video7:Video = new Video(553, 311);
video7.x = 0;
video7.y = 0;
video7.attachNetStream(ns7);

addChild(video2);
addChild(video3);
addChild(video4);
addChild(video5);
addChild(video6);
addChild(video7);

ns2.play(directory + videos[1]);
ns3.play(directory + videos[2]);
ns4.play(directory + videos[3]);
ns5.play(directory + videos[4]);
ns6.play(directory + videos[5]);
ns7.play(directory + videos[6]);

ns2.pause();
ns3.pause();
ns4.pause();
ns5.pause();
ns6.pause();
ns7.pause();

/*
Provide a callback function for the onMetaData event (otherwise Flash will throw errors). 
Create an object that will act as the NetStream’s client for the callback event. 
Once you have setup the onMetaData function for this object set the NetStream.client property. 
*/
var netClient:Object = new Object();
netClient.onMetaData = function(e:Object)
{
	//trace("netClient = " + e.duration);
};
ns.client = ns2.client = ns3.client = ns4.client = ns5.client = ns6.client = ns7.client = netClient;

// Handle sound level
var st:SoundTransform = new SoundTransform();
st.volume = 0; // set to zero to begin with so the user doesn't notice we are trying to preload
ns.soundTransform = st;

// Check buffer length
addEventListener(Event.ENTER_FRAME, checkStatus);
function checkStatus(e:Event):void
{
	//trace(ns.bufferLength);
	
	// Garbage Collect
	removeEventListener(Event.ENTER_FRAME, checkStatus);
	
	// Add video
	addChildAt(video, 0);
	
	// Restart the video
	ns.seek(0);
	
	// Control sound
	st.volume = 1;
	ns.soundTransform = st;
	
	// First fade out the 'buffer' clip
	Tweener.addTween(buffer, {alpha:0, time:1, transition:"linear", onComplete:function(){
		//
	}});
}

// Check for video end and then restart
ns.addEventListener(NetStatusEvent.NET_STATUS, onStatus);
function onStatus(e:Object):void
{
	//trace(e.info.code);
	
	if (e.info.code == "NetStream.Buffer.Stop") {
		//
	}
}

// Handle any errors
nc.addEventListener(SecurityErrorEvent.SECURITY_ERROR, securityErrorHandler);
function securityErrorHandler(e:SecurityErrorEvent):void 
{
	trace("securityErrorHandler: \n" + e);
}

// Toggle video playback (pause/play)
function togglePlayback():void
{
	ns.pause();
}
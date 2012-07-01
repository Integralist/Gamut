<?php
// Constants
define('MAX_WIDTH', 149);
define('MAX_HEIGHT', 149);
define('IMAGE_PER_ROW', 5);
define('JS_LIBRARY', "lightbox-group");

/**
 * This Class creates an image gallery of thumbnail images taken from a specified
 * directory on the server. It links each thumbnail image to the fullsize image.
 *
 * @author Mark McDonnell
 * @copyright Copyright (c) 2009, Mark McDonnell
 * @param string $dir a file directory which we can search for images
 * @param int $count the number of images to display per results page
 * @param array $types an Array of accepted image file formats
 * @version 1.1 {2009.02.18}
 */
class Gallery {
	// Private Properties
	private $directory;
	private $imagesPerPage;
	private $imageTypes;

	public function __construct($dir = null, $count = 10, $types = array('jpg'))
	{
		// Check if the dir variable has been set, if not then display an error
		if (!isset($dir)) {
			exit('Sorry, no directory value was provided and this is a required parameter');
		}
		
		$this->directory = $dir;
		$this->imagesPerPage = $count;
		$this->imageTypes = $types;
	}

	/*
	 * This method loops through the provided directory looking for images
	 * and displays them on screen as thumbnails which when clicked on
	 * will open the full sized image version.
	 *
	 * @return string $returnValue HTML code is returned so it can be displayed on screen
	 */
	public function display()
	{
		// Store reference to imageTypes Array and Directory
		$directory = $this->directory;
		$allowedImageFormats = $this->imageTypes;
		
		// Array to hold return value
		$returnValue = array();
		
		// Add trailing slash to the directory path if it's missing one
		if (substr($directory, -1) != "/") {
			$directory .= "/";
		}
		
		// Check we can open the directory
		$d = @dir($directory) or exit("<p>Failed opening directory '<b>$directory</b>' for reading</p>");
		
		// Loop through the Directory
		while (false !== ($img = $d->read())) {
			// Skip hidden files or the Thumbnail folder
			if ($img[0] == "." || $img[0] == "T") {
				continue;
			}
			
			// Make it easier to read the directory path followed by the full image name
			$file = $directory.$img;
			
			// Make sure the filename is readable so we can set it as the IMG title attribute value
			$cleanFilename = str_replace('-', ' ', $img);
			$filename = substr($cleanFilename, 0, -4);
			
			// Push each thumbnail image into the Array for reference later
			$thumbnail = $directory . 'thumbs/' . $img;
			
			// Store the file extension we are currently checking against our Array of allowed file formats
			$findExtension = substr(strtolower($file), strrpos($file,".") + 1);
			
			// If the file found matches against one of our allowed formats then store it in the return Array
			if (in_array($findExtension, $allowedImageFormats)) {
				$returnValue[] = array(
					"file" => $file,
					"name" => $filename,
					"thumbnail" => $thumbnail,
					"size" => getimagesize($file) // This function returns an Array with 7 elements { http://www.php.net/getimagesize }
				);
			}
		}
		
		// Garbage collection
		$d->close();
		
		// Total number of images
		$totalImages = count($returnValue);
		
		// Calculate the total number of pages
		$maxPages = ceil(count($returnValue) / $this->imagesPerPage);
		
		// Make sure the id querystring value exists and is numerical
		if (isset($_GET['id']) && is_numeric($_GET['id'])) {
			$id = $_GET['id'];
		} else {
			// Otherwise set the default page number to 1
			$id = 1;
		}
		
		// counter is used for looping through the main images
		$counter = 0;
		
		// Set the current page number
		$currentPage = $id;
		
		// Make sure the pagination links aren't displayed unless there are more images in total than allowed per page
		if ($totalImages > $this->imagesPerPage) {
			// Display details of this gallery to the user
			echo '<ul class="pagination">';
				echo '<li><a href="?id=' . $this->setPage('--', $currentPage, $maxPages) . '">back</a></li>';
				echo '<li><a href="?id=' . $this->setPage('++', $currentPage, $maxPages) . '" class="next">next</a></li>';
			echo '</ul>';
		}
		
		// Starting point of loop
		$start = ($currentPage * $this->imagesPerPage) - $this->imagesPerPage + 1;
		
		// End point of loop
		$end = ($currentPage * $this->imagesPerPage);
		
		// array to loop through the thumbnail array
		$arrayCounter = ($start-1);
		
		// Create an array that will store the HTML construction for each thumbnail image
		$thumbnails = array();
		
		// Display on page
		foreach($returnValue as $img) {
			$counter++;
			
			// Prevent the loop from displaying records before the start
			if ($counter < $start) {
				continue;
			}
			
			// Stop the loop from displaying more records then required
			if ($counter > $end) {
				break;
			}
			
			// Construct thumbnail HTML and store in array (this is method is advised over push_array() method)
			$thumbnails[] = "<a href='{$img['file']}' rel='" . JS_LIBRARY . "'><img src='{$img['thumbnail']}' width='" . MAX_WIDTH . "' height='" . MAX_HEIGHT . "' alt='{$img['name']}' title='{$img['name']}' /></a>";
			
			$arrayCounter++;
		}
			
		// If no images we're found ('count' method returns an int)
		if (!count($returnValue)) {
			echo("I'm sorry, no images were found?");
		} else {
			// Split the thumbnail array into chunks (makes it easier to create a dynamic HTML table)
			$thumbnails = array_chunk($thumbnails, IMAGE_PER_ROW);
			
			// construct HTML TABLE to display the thumbnails (passing in the array of thumbnail HTML)
			$this->buildTable($thumbnails);
		}
	}

   protected function setPage($direction, $num, $maxPages)
   {
		switch($direction) {
			case '--':
				$num--;
				break;
			case '++':
				$num++;
				break;
		}
		
		// Make sure the pagination doesn't exceed the max number of pages
		if ($num > $maxPages) {
			$num = 1;
		} else if ($num < 1) {
			$num = $maxPages;
		}
		
		return $num;
   }
	
	protected function buildTable($thumbs)
	{
		echo '<table>';
		
		// Loop through each array 'chunk'
		foreach ($thumbs as $set) { 
			echo "<tr>\n";
			
			// Loop through each item in this specific array
			foreach ($set as $item) { 
				echo "<td>$item</td>\n"; 
			} 
			
			echo "</tr>\n"; 
		}
		
		echo '</table>';
	}
}
?>
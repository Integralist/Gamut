<?php
	class Page
	{
		private $title;
		public $html;
		
		public function __construct($title = 'Default Page')
		{
			$this->title = $title;
			$this->html = '';
		}
		
		public function makeHeader($header){
			$this->html .= '<html><head><title>'.
			$this->title . '</title></head><body>' . $header;
		}
		
		public function makeBody($content=array())
		{
			// HERE IS WHERE COMPOSITION IS USED ('HAS-A' RATHER THAN 'IS-A' / WHEN USING INHERITANCE, A CLASS 'IS-A')
			return new Table($this, $content);
		}
		
		public function makeFooter($footer)
		{
			$this->html .= $footer . '</body></html>';
		}
		
		public function display()
		{
			return $this->html;
		}
	}
	
	class Table 
	{
		private $page;
		private $content;
		private $id;
		
		public function __construct($page, $content)
		{
			$this->page = $page;
			$this->content = $content;
			$this->id = 'defaultID';
		}

		public function setId($id)
		{
			$this->id = $id;
		}
		
		public function build($colorA, $colorB)
		{
			$this->page->html .= '<table id="'.$this->id.'" width="100%">';
			$i = 0;
			
			foreach($this->content as $row) {
				$bgcolor = ($i % 2) ? $colorA : $colorB;
				
				$this->page->html .= '<tr bgcolor="' . $bgcolor . '"><td>' . $row . '</td></tr>';
				
				$i++;
			}
			
			$this->page->html .= '</table>';
			
			return $this->page->html;
		}
	}
	
	// instantiate a new Page object
	$page = new Page();
	
	// make header
	$page->makeHeader('<div>Header</div>');
	
	// set Table object parameters
	$table = $page->makeBody(range(0,20));
	$table->setId('maincontent');
	
	// build body table
	$table->build('#ffcc00','#eeeeee');
	
	// make footer
	$page->makeFooter('<div>Footer</div>');
	
	// display page
	echo $page->display();
?>
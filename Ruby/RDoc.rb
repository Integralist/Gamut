#!/usr/bin/env ruby

=begin
	Description:
	RDoc creates documentation from Ruby code comments
	
	Example:
	rdoc <file>.rb
	
	Notes:
	If you run rdoc with no filename supplied then it will process all Ruby files found in the current directory.
	To ignore a particular item use #:nodoc: at the end of the line (e.g. end of method name)
	You can also use #:nodoc: all after a Class to make RDoc ignore all contained methods
	If there are comments you want left out then wrap them in -- and ++
	
	Command Line Flags:
	--all: Usually RDoc processes only public methods, but --all forces RDoc to document all methods within the source files.
	--fmt <format name>: Produce documentation in a certain format (default is html, but xml, yaml, chm, and pdf are available under some configurations).
	--help: Get help with using RDoc’s command-line options and find out which output formatters are available.
	--inline-source: Usually source code is shown using popups, but this option forces code to be shown inline with the documentation.
	--main <name>: Set the class, module, or file that appears as the main index page for the documentation to <name> (for example, rdoc --main MyClass).
	--one-file: Make RDoc place all the documentation into a single file.
	--op <directory name>: Set the output directory to <directory name> (default is doc).
	
	Full example:
	#= RDoc Example
	#
	#== This is a heading
	#
	#* First item in an outer list
	#  * First item in an inner list
	#  * Second item in an inner list
	#* Second item in an outer list
	#  * Only item in this inner list
	#
	#== This is a second heading
	#
	#Visit www.rubyinside.com
	#
	#== Test of text formatting features
	#
	#Want to see *bold* or _italic_ text? You can even embed
	#+text that looks like code+ by surrounding it with plus
	#symbols. Indented code will be automatically formatted:
	#
	#	class MyClass
	#		def method_name
	#			puts "test"
	#		end
	#	end
=end

# This class stores information about people.
class Person
	attr_accessor :name, :age, :gender

	# Create the person object and store their name
	def initialize(name)
		@name = name
	end
	
	# Print this person's name to the screen
	def print_name
		puts "Person called #{@name}"
	end
end
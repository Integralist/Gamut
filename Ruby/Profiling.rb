#!/usr/bin/env ruby

=begin
	Whereas benchmarking is the process of measuring the total time it takes to achieve something 
	and comparing those results between different versions of code, 
	profiling tells you what code is taking what amount of time.
	
	Ruby comes with a code profiler built in, and all you have to do to have your code profiled automatically is to 
	add require "profile" to the start of your code or run it with ruby -r profile before your source file name 
	(this may be more practical on code you have already written and wish to profile, for example)
=end

require "profile"

class Calculator
	def self.count_to_large_number
		x = 0
		10000.times { x += 1 }
	end
	def self.count_to_small_number
		x = 0
		1000.times { x += 1 }
	end
end

Calculator.count_to_large_number
Calculator.count_to_small_number

=begin
	You can use a library called profiler (which profile uses to do its work) 
	to profile a specific section of your program rather than the entire thing. 
	
	To do this, use require 'profiler' and the commands 
	Profiler__::start_profile, 
	Profiler__::stop_profile, and 
	Profiler__::print_ profile($stdout) in the relevant locations.
=end
#!/usr/bin/env ruby

=begin 
	Because times are so easy to manipulate, 
	some developers extend the Fixnum class 
	with some helper methods to make manipulating dates easier:
=end

class Fixnum
	def seconds
		self
	end
	def minutes
		self * 60
	end
	def hours
		self * 60 * 60
	end
	def days
		self * 60 * 60 * 24
	end
end

puts Time.now
puts Time.now + 10.minutes
puts Time.now + 2.hours
puts Time.now - 7.days
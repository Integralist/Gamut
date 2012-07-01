#!/usr/bin/env ruby

=begin
class Person
	def initialize(name)
		raise ArgumentError, "No name provided dummy!" if name.empty?
	end
end

fred = Person.new("")

print fred
=end

# You could create your own type of error handling

class BadAssException < RuntimeError
	
end

class Person2
	def initialize(name)
		raise BadAssException, "No name fool!" if name.empty?
	end
end

bob = Person2.new ""

print bob

# Ruby has a try/catch type clause called begin/rescue/end

=begin
	def willCauseError
		begin
			puts 10 / 0
		rescue => e
			puts "Error was #{e.class}" # => error was ZeroDivisionError
		end
	end
=end

# Which can also be used to handle different types of errors

=begin
	def loadData
		begin
			#code
		rescue ZeroDivisionError
			# code to rescue the zero division exception here
		rescue YourOwnException
			# code to rescue a different type of exception here
		rescue
			# code that rescues all other types of exception here
		end
	end
=end

# Throw/Catch example

catch :finish do
    1000.times do
        x = rand(1000)
        throw :finish if x == 123
    end
    
    puts "Generated 1000 random numbers without generating 123!" # this message only displays when error is thrown (might have to run it a couple of times)
end
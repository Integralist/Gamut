#!/usr/bin/env ruby

i = 1
j = 0

until i > 1000000
	i *= 2
	j += 1
end

puts "i = #{i}, j = #{j}"

=begin
	run normally you'll see the result:
		i = 1048576, j = 20
	
	but run with: ruby –r debug Debugger.rb ...you'll see the result:
		Debug.rb
		Emacs support available
		debugtest.rb:3:i = 1
		(rdb:1)
		
	...now you can type commands (expressions and statements) into the prompt (like you can with irb)
	
	Here are the most useful commands to use at the debugger prompt:
	
	list: 	Lists the lines of the program currently being worked upon. 
			You can follow list by a range of line numbers to show. 
			For example, list 2-4 shows code lines 2 through 4. Without any arguments, list shows a local portion of the program to the current execution point.
	
	step: 	Runs the next line of the program. 
			step literally steps through the program line by line, executing a single line at a time. 
			After each step, you can check variables, change values, and so on. 
			This allows you to trace the exact point at which bugs occur. 
			Follow step by the number of lines you wish to execute if it’s higher than one, such as step 2 to execute two lines.
			
	cont: 	Runs the program without stepping. 
			Execution will continue until the program ends, reaches a breakpoint, or a watch condition becomes true.
			
	break: 	Sets a breakpoint at a particular line number, such as with break 3 to set a breakpoint at line 3. 
			This means that if you continue execution with cont, execution will run until line 3 and then stop again. 
			This is useful for stopping execution at a place where you want to see what’s going on.
	
	watch: 	Sets a condition breakpoint. Rather than choosing a certain line upon which to stop, you specify a condition that causes execution to stop. 
			For example, if you want the program to stop when x is larger than 10, use watch x > 10. 
			This is perfect for discovering the exact point where a bug occurs if it results in a certain condition becoming true.
			e.g. watch i > 10000
			
	quit: 	Exits the debugger.
=end
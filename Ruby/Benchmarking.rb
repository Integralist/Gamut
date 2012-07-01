#!/usr/bin/env ruby

require "benchmark"

=begin
	puts Benchmark.measure {
		1050.times { print "." } 
	}
=end

iterations = 1050

b = Benchmark.measure do
	for i in 1..iterations do
		x = i
	end
end

c = Benchmark.measure do
	iterations.times do |i|
		x = i
	end
end

# Here we just print out the result of the benchmark
puts b 
puts c

# Benchmark also includes a way to make completing multiple tests more convenient. 
# You can rewrite the preceding benchmarking scenario like this:

Benchmark.bm do |bm|
	bm.report("for:") do
		for i in 1..iterations do 
			x = i
		end
	end
	bm.report("times:") do
		iterations.times do |i|
			x = i 
		end
	end 
end

# The primary difference with using the bm method is that it allows you to collect a group of benchmark tests together and display the results in a prettier way. 

# Another method, bmbm, repeats the benchmark set twice, using the first as a “rehearsal” and the second for the true results, 
# as in some situations CPU caching, memory caching, and other factors can taint the results. 

Benchmark.bmbm do |bm|
	bm.report("for:") do
		for i in 1..iterations do 
			x = i
		end
	end
	bm.report("times:") do
		iterations.times do |i|
			x = i 
		end
	end 
end
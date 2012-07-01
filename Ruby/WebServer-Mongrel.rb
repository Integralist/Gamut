#!/usr/bin/env ruby

=begin
	Mongrel is a fast HTTP server and library for Ruby intended for hosting Ruby applications and services. 
	It’s similar to WEBrick, but is significantly faster, although the downside is that it doesn’t come with Ruby by default. 
	Many high-profile Ruby on Rails web sites use Mongrel for their deployment because of its speed, stability, and reliability.
	
	You can install Mongrel with RubyGem:
	   gem install mongrel

	http://mongrel.rubyforge.org/
	
	UPDATE...
	
	Mongrel is deprecated (doesn't run with Ruby 1.9). Use Unicorn instead:
	   
	   http://unicorn.bogomips.org/
=end

require "mongrel"

class BasicServer < Mongrel::HttpHandler
    def process (request, response)
        response.start(200) do |headers, output|
            headers["Content-Type"] = "text/html"
            output.write '<html lang="en" dir="ltr"><body><h1>Hello World!</h1></body></html>'
        end
    end
end

server = Mongrel::HttpServer.new("0.0.0.0", "1234")
server.register("/", BasicServer.new)
server.run.join

# Mongrel::HttpServer.new can also take an optional third argument that specifies the number of threads to open to handle requests.
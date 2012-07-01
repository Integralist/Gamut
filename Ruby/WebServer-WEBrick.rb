#!/usr/bin/env ruby

require "webrick"

=begin
    WEBrick is a Ruby library that makes it easy to build an HTTP server with Ruby. 
    It comes with most installations of Ruby by default (it’s part of the standard library), 
    so you can usually create a basic web/HTTP server with only several lines of code.
    
    The following code creates a generic WEBrick server on the local machine on port 1234, 
    shuts the server down if the process is interrupted (often done with Ctrl+C), 
    and for each new connection prints the current date and time. 
    If you run this code, you could try to view the results in your web browser by 
    visiting http://127.0.0.1:1234/ or http://localhost:1234/
=end

=begin
    server = WEBrick::GenericServer.new(:Port => 1234)

    trap("INT") {
        server.shutdown
    }
        
	server.start do |socket|
        socket.puts Time.now
    end
=end

# A more elaborate example

=begin
	class MyServlet < WEBrick::HTTPServlet::AbstractServlet
        def do_GET (request, response)
            response.status = 200
            response.content_type = "text/plain"
            response.body = "Hello world! You are trying to load #{request.path}"
        end
    end
    
    server = WEBrick::HTTPServer.new(:Port => 1234)
    
    server.mount "/", MyServlet
    
    trap("INT") {
        server.shutdown
    }
    
    server.start
=end

# An even more elaborate example
# Use http://localhost:1234/add?a=10&b=10 or http://localhost:1234/subtract?a=10&b=9

class MyNormalClass
    def self.add (a, b)
        a.to_i + b.to_i
    end
    
    def self.subtract (a, b)
        a.to_i - b.to_i
    end
end

class MyServlet < WEBrick::HTTPServlet::AbstractServlet
    def do_GET (request, response)
        if request.query["a"] && request.query["b"]
            a = request.query["a"]
            b = request.query["b"]
            response.status = 200
            response.content_type = "text/plain"
            result = nil
            
            case request.path
                when "/add"
                    result = MyNormalClass.add(a, b)
                when "/subtract"
                    result = MyNormalClass.subtract(a, b)
                else
                    result = "No such method"
            end
            
            response.body = result.to_s + "\n"
        else
            response.status = 200
            response.body = "You did not provide the correct parameters"
        end
    end
end

server = WEBrick::HTTPServer.new(:Port => 1234)

server.mount "/", MyServlet

trap("INT") {
    server.shutdown
}

server.start
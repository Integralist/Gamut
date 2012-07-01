#!/usr/bin/env ruby

=begin
	RPC (e.g. SOAP)
=end

require "xmlrpc/client"

server = XMLRPC::Client.new2("http://www.rubyinside.com/book/xmlrpctest.cgi") # This example uses a remote application (written in PHP) that makes available a method called sample.sumAndDifference

# puts server.call("sample.sumAndDifference", 5, 3).inspect # {"sum"=>8, "difference"=>2}

ok, results = server.call2("sample.sumAndDifference", 5, 3)

# call2 returns an array containing a “success” flag and the results. 
# You can check to see if the first element of the array (the “success” flag) is true, but if not, you can investigate the error.
if ok 
    puts results.inspect
else 
    puts results.faultCode
    puts results.faultString
end 

=begin
	Calling XML-RPC–enabled programs is easy, but so is XML-RPC–enabling your own:
	
	require 'xmlrpc/server'
    server = XMLRPC::Server.new(1234)
    server.add_handler("sample.sumAndDifference") do |a,b|
      { "sum" => a.to_i + b.to_i,
        "difference" => a.to_i - b.to_i }
    end
    trap("INT") { server.shutdown }
    server.serve
    
    This program runs an XML-RPC server (based on WEBrick) on your local machine on port 1234, 
    and operates in the same way as the sample.php used in the client in the previous section.
=end
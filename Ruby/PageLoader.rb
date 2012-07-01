#!/usr/bin/env ruby

require "net/http"


#The net/http library is only a basic library, and it requires its input to be sanitized in advance.
#The URI library is ideally suited to this task.
Net::HTTP.get_print "www.google.com", "/"

=begin
	url = URI.parse("http://www.google.com/")
	
	response = Net::HTTP.start(url.host, url.port) do |http|
		http.get(url.path)
	end
	
	content = response.body
=end

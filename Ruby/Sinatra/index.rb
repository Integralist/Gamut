#!/usr/bin/env ruby

# To make Sinatra run on a different port then run: ruby sinatra1.rb -p 1234
# I use Shotgun: gem install shotgun (execute it...) shotgun index.rb which automatically reloads all files on every request (which means I don't have to keep stopping/starting Sinatra)

require "sinatra"

# This helps direct the requests for static resources to the correct location
# e.g. Assets/Styles/test.css
set :public_folder, File.dirname(__FILE__)

# First lets set-up an error handler for when a user tries to access a URL that doesn't exist
# I could have separated out the layout and the template but here I'm just loading the same file for both
# Luckily this just loads the one (I normally wouldn't have to specify a layout, but this is a test file
# so I'm temporarily including an 'inline' layout below which forces me here to specify an external layout)
not_found do
    erb :error, :layout => :error
end

error do
    "Sorry there was a nasty error - " + env["sinatra.error"].name
end

#error MyCustomError do
#  'So what happened was...' + env['sinatra.error'].message
#end

#get '/testingerror' do
#  raise MyCustomError, 'something bad'
#end

# http://127.0.0.1:9393/testerror/40/10 is fine
# http://127.0.0.1:9393/testerror/10/0 should error
get '/testerror/:a/:b' do |a, b|
  "#{a.to_i / b.to_i}"
end

get "/" do
    #'Hello World!<br><f><a href="http://www.google.com">Google</a>'
    %q{
        Hello World!<br><f><a href="http://www.google.com">Google</a>
        <form method="post">
        Enter your name: <input type="text" name="name" />
        <input type="submit" value="Go!" />
        </form>
    }
end

post "/" do
    # We redirect the user back to the home page if they don't enter the name "Mark"
    redirect "/error" if params[:name] != "Mark"
    
    # Notice when receiving post data from a form field we need to use the "Named Parameter" rather than "Block Parameters"
    "Hello #{params[:name]}"
end

# This displays a message for the user if they entered the name value incorrectly
get "/error" do
    "Sorry, you should have entered your name as 'Mark'"
end

# We use 'Named Parameters'
get "/add/:a/:b" do
    # http://localhost:4567/add/5/1 which should display 6 (5+1)
    (params[:a].to_i + params[:b].to_i).to_s
end

# But we could just as easily use block parameters...
get "/subtract/:a/:b" do |a, b|
    # http://localhost:4567/subtract/5/1 which should display 4 (5-1)
    (a.to_i - b.to_i).to_s
end

get "/divide/:a/:b" do |a, b|
    (a.to_i / b.to_i).to_s
end

=begin
    The following example demonstrates how to Halt a process
=end

get "/robot" do
    %q{
        <form method="post">
        Enter your password: <input type="password" name="pass" />
        <input type="submit" value="Login" />
        </form>
    }
end

post "/robot" do
    halt [403, "Forbidden"] if params[:pass] != "mypass"
    "Hey there, here is some secret data"
end

# Lets look at templating using Erb
# The "before" code block is executed before ALL requests
# http://127.0.0.1:9393/erb-template

before do
    @people = [
        { :name => "Mark", :age => 30 },
        { :name => "Brad", :age => 21 },
        { :name => "Ash", :age => 21 }
    ] 
end

# Using in-line templates & layouts
get "/erb-template" do
    erb :index
end

# Using external templates & layouts
get "/erb-template-external" do
    erb :mytemplate, :layout => :mylayout
end

=begin
	# We store the 'templates' at the end of the file using the __END__ delimiter
	# In Ruby, if the __END__ delimiter is used, then any text coming after it is not processed as Ruby code 
	# but as input to the application if the application so chooses to read it. 
	# Sinatra can use this functionality to support placing named templates into the source code file itself.
	
	# For Erb we could have instead not used an "In-File" template but an "Inline" one...
	
	erb %{
	   <% @people.each do |person| %>
	       <p><%= person[:name] %> is <%= person[:age] %> years old</p>
	   <% end %>
	}  
=end

__END__

=begin
	This application has two templates: layout and index. 
	When the index template is rendered, erb will notice that there’s a template called layout and render that first, 
	only yielding to the index template when it encounters the yield method.
	This results in a page that contains all of layout’s HTML, but with index’s specific HTML embedded within.
	You can, of course, have more than one layout.
	If you defined a second layout called anotherlayout, you could tell erb to render it specifically:
	
	erb :index, :layout => :anotherlayout
	
	You could also choose to render no layout at all:
	
	erb :index, :layout => false
=end

=begin
	By default, external template files are expected to be in a directory called views located within that of your source code file, 
	although you can override this if you wish using a set directive at the start of your app:

	set :views, File.dirname(__FILE__) + '/templates'
=end

@@ layout
    <html lang="en" dir="ltr">
        <head>
            <meta charset="utf-8">
            <title>Using Erb Templates</title>
        </head>
        <body>
            <h1>Erb Templates</h1>
            <%= yield %>
        </body>
    </html>
    
@@ anotherlayout
    <html lang="en" dir="ltr">
        <head>
            <meta charset="utf-8">
            <title>Using Erb Templates 2</title>
        </head>
        <body>
            <h2>Erb Templates 2</h2>
            <%= yield %>
        </body>
    </html>

@@ index
    <% @people.each do |person| %>
       <p><%= person[:name] %> is <%= person[:age] %> years old</p>     
    <% end %>
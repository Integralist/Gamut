#!/usr/bin/env ruby

require "pony"

Pony.mail(:to => 'email@domain.com', :from => 'me@example.com', :subject => 'Hello', :body => 'This is the email body')

# http://adam.heroku.com/past/2008/11/2/pony_the_express_way_to_send_email_from_ruby/

=begin
	Pony.mail(:to => 'user@domain.tld', :via => :smtp, :via_options => {
        :address => 'smtp.gmail.com',
        :port => '587',
        :enable_starttls_auto => true,
        :user_name => 'id_gmail',
        :password => 'xxxx',
        :authentication => :plain, # :plain, :login, :cram_md5, no auth by default
        :domain => "HELLO", # don't know exactly what should be here
    },
    :subject => 'hi', :body => 'Hello there.')
    
    # With Sinatra...
    
    post '/guestbook/sign' do
    Pony.mail   :to => params[:email],
                :from => "me@example.com",
                :subject => "Thanks for signing my guestbook, #{params[:name]}!",
                :body => erb(:email)
    end
    
    # http://www.tutorialspoint.com/ruby/ruby_sending_email.htm
    
    require 'net/smtp'

    message = <<MESSAGE_END
    From: Private Person <me@fromdomain.com>
    To: A Test User <test@todomain.com>
    MIME-Version: 1.0
    Content-type: text/html
    Subject: SMTP e-mail test
    
    This is an e-mail message to be sent in HTML format
    
    <b>This is HTML message.</b>
    <h1>This is headline.</h1>
    MESSAGE_END
    
    Net::SMTP.start('localhost') do |smtp|
      smtp.send_message message, 'me@fromdomain.com', 
                                 'test@todomain.com'
    end
=end
#!/usr/bin/env ruby

class MegaGreeter
    attr_accessor :names
    
    # Create the object
    def initialize (names = "World")
        @names = names
    end
    
    # Say hello to everyone
    def say_hi
        if @names.nil?
            puts "..."
        elsif @names.respond_to?("each")
            # @names appears to be an list (Array) of some kind, so lets iterate!
            @names.each do |name| # we specify that each item should be referenced by 'name'
                puts "Hello #{name}!"
            end
        else
            puts "Hello #{@names}!"
        end
    end
    
    # Say goodbye to everyone
    def say_bye
        if @names.nil?
            puts "..."
        elsif @names.respond_to?("join")
            # Join the list of items with commas
            puts "Goodbye #{@names.join(", ")}. Come back soon!"
        else
            puts "Goodbye #{@names}. Come back soon!"
        end
    end
end

# Following classes 'MyClass' and 'MyClass2' demonstrate difference between 'class variable' and 'instance variable'
class MyClass
    def initialize
        @@class_var = 123
    end
    def showValue
        puts @@class_var
    end
    def setValue
        @@class_var = 456;
    end
end

class MyClass2
    def initialize
        @class_var = 123
    end
    def showValue
        puts @class_var
    end
    def setValue
        @class_var = 456;
    end
end

if __FILE__ == $0

    objA = MyClass.new()
    objB = MyClass.new()
    
    objA.showValue # => 123
    objB.showValue # => 123
    
    objA.setValue
    
    objA.showValue # => 456
    objB.showValue # => 456
    
    #############################
    
    objC = MyClass2.new()
    objD = MyClass2.new()
    
    objC.showValue # => 123
    objD.showValue # => 123
    
    objC.setValue
    
    objC.showValue # => 456
    objD.showValue # => 123

    mg = MegaGreeter.new
    mg.say_hi
    mg.say_bye
    
    # Change the name to be "Zeke"
    mg.names = "Mark"
    mg.say_hi
    mg.say_bye
    
    # Change the name to be an Array of names
    mg.names = ["Ash", "Brad", "James", "Dave", "Neil"]
    mg.say_hi
    mg.say_bye
    
    # Change to nil
    mg.names = nil
    mg.say_hi
    mg.say_bye

end
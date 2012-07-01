#!/usr/bin/env ruby

require "RedCloth"

r = RedCloth.new "this is a *test* of _using RedCloth_"

puts r.to_html

# Generates: <p>this is a <strong>test</strong> of <em>using RedCloth</em></p>